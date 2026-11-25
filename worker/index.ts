/**
 * Background worker — runs AI jobs and file extraction in isolation.
 * No direct user-facing routes; communicates via BullMQ queues + DB updates.
 * This process has network access ONLY to: Ollama (192.168.0.14), PostgreSQL, MinIO, Redis.
 */
import { Worker, Queue, type Job } from 'bullmq'
import { db } from '../lib/db'
import { chat, scoreCV, draftJD, draftOutreach, analyseTender } from '../lib/ollama'
import { getPresignedUrl, deleteFile, BUCKETS } from '../lib/minio'
import { getRedisConnection } from '../lib/queue'
const redisConnection = getRedisConnection()
const cvScoreQ = new Queue('cv-score', { connection: redisConnection })
import type { CvScoreJob, JdDraftJob, TenderAnalysisJob, OutreachJob, PdfExtractJob } from '../lib/queue'

// ── PDF / DOCX extraction ─────────────────────────────────────────────────────
// Dynamic imports — these modules use native bindings
async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    // @ts-expect-error — no types shipped
    const pdfParse = (await import('pdf-parse')).default
    const result = await pdfParse(buffer)
    return result.text
  }
  if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }
  throw new Error(`Unsupported MIME type: ${mimeType}`)
}

// ── Workers ───────────────────────────────────────────────────────────────────

new Worker<PdfExtractJob>('pdf-extract', async (job: Job<PdfExtractJob>) => {
  const { candidateId, fileKey, bucket } = job.data
  const url = await getPresignedUrl(bucket, fileKey)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`MinIO fetch failed: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') ?? 'application/pdf'

  const text = await extractText(buffer, contentType)

  await db.candidate.update({
    where: { id: candidateId },
    data: { cvText: text, cvExtractedAt: new Date() },
  })

  // Queue scoring against any active jobs this candidate has applied for
  const applications = await db.application.findMany({
    where: { candidateId, job: { status: 'ACTIVE' } },
    include: { job: true },
  })

  for (const app of applications) {
    if (app.job.description) {
      await cvScoreQ.add('score', {
        candidateId,
        jobId: app.jobId,
        cvText: text,
        jobDescription: app.job.description,
      } satisfies CvScoreJob)
    }
  }
}, { connection: redisConnection, concurrency: 2 })

new Worker<CvScoreJob>('cv-score', async (job: Job<CvScoreJob>) => {
  const { candidateId, jobId, cvText, jobDescription } = job.data
  const start = Date.now()

  const result = await scoreCV(jobDescription, cvText)

  const score = typeof result.score === 'number' ? result.score : 0
  const latencyMs = Date.now() - start

  await db.aiScore.create({
    data: {
      candidateId,
      jobId,
      model: process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:32b',
      score,
      reasoning: result.summary,
      skills: result.strengths ?? [],
      gaps: result.concerns ?? [],
      latencyMs,
    },
  })

  await db.application.updateMany({
    where: { candidateId, jobId },
    data: { score },
  })
}, { connection: redisConnection, concurrency: 2 })

new Worker<JdDraftJob>('jd-draft', async (job: Job<JdDraftJob>) => {
  const { jobId, title, skills, location, contractType, salaryRange } = job.data
  const context = `Skills: ${skills.join(', ')}. Location: ${location}. Contract: ${contractType}.${salaryRange ? ` Salary: ${salaryRange}` : ''}`
  const draft = await draftJD(title, context)

  await db.job.update({ where: { id: jobId }, data: { aiDraft: draft } })
}, { connection: redisConnection, concurrency: 1 })

new Worker<TenderAnalysisJob>('tender-analysis', async (job: Job<TenderAnalysisJob>) => {
  const { tenderId, rawText, clientName } = job.data
  const result = await analyseTender(rawText, clientName)

  await db.tender.update({
    where: { id: tenderId },
    data: {
      aiAnalysis: result.summary,
      aiScore: result.score,
    },
  })
}, { connection: redisConnection, concurrency: 1 })

new Worker<OutreachJob>('outreach', async (job: Job<OutreachJob>) => {
  const { candidateId, jobId } = job.data
  const [candidate, jobRec] = await Promise.all([
    db.candidate.findUniqueOrThrow({ where: { id: candidateId } }),
    db.job.findUniqueOrThrow({ where: { id: jobId }, include: { client: true } }),
  ])

  const latestScore = await db.aiScore.findFirst({
    where: { candidateId, jobId },
    orderBy: { createdAt: 'desc' },
  })

  const matchSummary = latestScore?.reasoning ?? `${candidate.skills.slice(0, 3).join(', ')} background`
  const name = `${candidate.firstName} ${candidate.lastName}`
  const company = jobRec.client?.name ?? 'our client'

  return draftOutreach(name, jobRec.title, company, matchSummary)
}, { connection: redisConnection, concurrency: 2 })

console.log('[worker] HAT Recruit background worker started')
