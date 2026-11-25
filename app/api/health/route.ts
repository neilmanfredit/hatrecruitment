import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const checks: Record<string, string> = {}

  try {
    await db.$queryRaw`SELECT 1`
    checks.database = 'ok'
  } catch {
    checks.database = 'error'
  }

  // Queue depth check — warn if cv-score queue is backed up
  if (process.env.REDIS_URL) {
    try {
      const { Queue } = await import('bullmq')
      const IORedis = (await import('ioredis')).default
      const conn = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
      const q = new Queue('cv-score', { connection: conn })
      const waiting = await q.getWaitingCount()
      checks.cvScoreQueue = waiting > 50 ? `warn:${waiting} waiting` : `ok:${waiting} waiting`
      await conn.quit()
    } catch {
      checks.cvScoreQueue = 'unavailable'
    }
  }

  const allOk = Object.values(checks).every(v => v.startsWith('ok') || v === 'unavailable')
  return NextResponse.json({ status: allOk ? 'ok' : 'degraded', checks }, {
    status: allOk ? 200 : 503,
  })
}
