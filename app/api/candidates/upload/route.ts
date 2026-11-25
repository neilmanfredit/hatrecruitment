import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAuth, RECRUITER_ROLES } from '@/lib/rbac'
import { uploadFile, BUCKETS } from '@/lib/minio'
import { queues } from '@/lib/queue'
import type { PdfExtractJob } from '@/lib/queue'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
])
// Magic bytes for PDF and DOCX (ZIP)
const MAGIC: Array<[Buffer, string]> = [
  [Buffer.from([0x25, 0x50, 0x44, 0x46]), 'application/pdf'],
  [Buffer.from([0x50, 0x4b, 0x03, 0x04]), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
]

function detectMime(buf: Buffer): string | null {
  for (const [magic, mime] of MAGIC) {
    if (buf.subarray(0, magic.length).equals(magic)) return mime
  }
  return null
}

export const POST = withAuth(async (req) => {
  const form = await req.formData()
  const candidateId = form.get('candidateId') as string | null
  const file = form.get('file') as File | null

  if (!candidateId || !file) {
    return NextResponse.json({ error: 'candidateId and file required' }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 })
  }

  const declaredMime = file.type
  if (!ALLOWED_MIME.has(declaredMime)) {
    return NextResponse.json({ error: 'Only PDF or DOCX files allowed' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // Validate magic bytes — reject polyglot files that lie about their type
  const detectedMime = detectMime(buffer)
  if (!detectedMime || !ALLOWED_MIME.has(detectedMime)) {
    return NextResponse.json({ error: 'File content does not match declared type' }, { status: 400 })
  }

  const fileKey = `${candidateId}/${Date.now()}-cv${detectedMime === 'application/pdf' ? '.pdf' : '.docx'}`
  await uploadFile(BUCKETS.cvs, fileKey, buffer, detectedMime)

  await db.candidate.update({
    where: { id: candidateId },
    data: { cvFileKey: fileKey },
  })

  // Queue PDF extraction + AI scoring (runs in isolated worker)
  await queues.pdfExtract.add('extract', {
    candidateId,
    fileKey,
    bucket: BUCKETS.cvs,
  } satisfies PdfExtractJob)

  return NextResponse.json({ fileKey, status: 'queued' }, { status: 202 })
}, RECRUITER_ROLES)
