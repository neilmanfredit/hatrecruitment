import { NextResponse } from 'next/server'
import { withAuth, RECRUITER_ROLES } from '@/lib/rbac'
import { searchJobs } from '@/lib/reed'
import { db } from '@/lib/db'

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const keywords = searchParams.get('keywords') ?? undefined
  const location = searchParams.get('location') ?? undefined

  if (!process.env.REED_API_KEY) {
    return NextResponse.json(
      { error: 'Reed API not configured', hint: 'Set REED_API_KEY — register free at reed.co.uk/developers' },
      { status: 503 }
    )
  }

  const jobs = await searchJobs({ keywords, locationName: location, resultsToTake: 25 })

  // Store as sourcing leads
  for (const job of jobs.slice(0, 10)) {
    await db.sourcingLead.upsert({
      where: { id: `reed-${job.jobId}` } as never,
      create: {
        id: `reed-${job.jobId}`,
        source: 'reed',
        externalId: String(job.jobId),
        type: 'job',
        title: job.jobTitle,
        name: job.employerName,
        rawData: job as never,
      },
      update: { rawData: job as never },
    })
  }

  return NextResponse.json({ results: jobs, count: jobs.length })
}, RECRUITER_ROLES)
