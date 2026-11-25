import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAuth, RECRUITER_ROLES, ADMIN_ONLY } from '@/lib/rbac'
import { deleteFile, BUCKETS } from '@/lib/minio'

export const GET = withAuth(async (_req, { params }) => {
  const id = params.id
  if (!id) return NextResponse.json({ error: 'Bad request' }, { status: 400 })

  const candidate = await db.candidate.findUnique({
    where: { id },
    include: {
      applications: { include: { job: { select: { id: true, title: true } } } },
      aiScores: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  })
  if (!candidate || candidate.status === 'GDPR_ERASED') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(candidate)
}, RECRUITER_ROLES)

export const DELETE = withAuth(async (_req, { params }) => {
  const id = params.id
  if (!id) return NextResponse.json({ error: 'Bad request' }, { status: 400 })

  const candidate = await db.candidate.findUnique({ where: { id } })
  if (!candidate) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // GDPR erasure: delete CV from MinIO first
  if (candidate.cvFileKey) {
    await deleteFile(BUCKETS.cvs, candidate.cvFileKey).catch(() => null)
  }

  // Anonymise rather than hard-delete to preserve pipeline history
  await db.candidate.update({
    where: { id },
    data: {
      firstName: '[Erased]',
      lastName: '[Erased]',
      email: `erased-${id}@gdpr.local`,
      phone: null,
      linkedinUrl: null,
      cvText: null,
      cvFileKey: null,
      status: 'GDPR_ERASED',
    },
  })

  return NextResponse.json({ success: true })
}, ADMIN_ONLY)
