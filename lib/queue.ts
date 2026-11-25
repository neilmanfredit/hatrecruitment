import { Queue, Worker, QueueEvents } from 'bullmq'
import IORedis from 'ioredis'

function getRedisUrl(): string {
  return process.env.REDIS_URL ?? 'redis://hat-recruit-redis:6379'
}

// Lazy queue factory — avoids connecting to Redis at module import time (breaks SSG)
function makeQueue(name: string): Queue {
  const conn = new IORedis(getRedisUrl(), { maxRetriesPerRequest: null })
  return new Queue(name, { connection: conn })
}

export const queues = {
  get cvScore() { return makeQueue('cv-score') },
  get jdDraft() { return makeQueue('jd-draft') },
  get tenderAnalysis() { return makeQueue('tender-analysis') },
  get outreach() { return makeQueue('outreach') },
  get pdfExtract() { return makeQueue('pdf-extract') },
}

export type QueueName = keyof typeof queues

export interface CvScoreJob {
  candidateId: string
  jobId: string
  cvText: string
  jobDescription: string
}

export interface JdDraftJob {
  jobId: string
  title: string
  skills: string[]
  location: string
  contractType: string
  salaryRange?: string
}

export interface TenderAnalysisJob {
  tenderId: string
  rawText: string
  clientName: string
}

export interface OutreachJob {
  candidateId: string
  jobId: string
  tone: 'formal' | 'casual'
}

export interface PdfExtractJob {
  candidateId: string
  fileKey: string
  bucket: string
}

export function getRedisConnection() {
  return new IORedis(getRedisUrl(), { maxRetriesPerRequest: null })
}

export { Worker, QueueEvents }
