import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { withAuth, RECRUITER_ROLES } from '@/lib/rbac'
import { queues } from '@/lib/queue'
import type { JdDraftJob } from '@/lib/queue'

const CreateJobSchema = z.object({
  title: z.string().min(1),
  clientId: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  remote: z.boolean().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  contractType: z.string().optional(),
  skills: z.array(z.string()).optional(),
  generateJD: z.boolean().optional(),
})

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? undefined
  const clientId = searchParams.get('clientId') ?? undefined

  const jobs = await db.job.findMany({
    where: { ...(status && { status: status as never }), ...(clientId && { clientId }) },
    include: { client: { select: { id: true, name: true } }, _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(jobs)
}, RECRUITER_ROLES)

export const POST = withAuth(async (req, { payload }) => {
  const body = CreateJobSchema.parse(await req.json())

  const job = await db.job.create({
    data: {
      title: body.title,
      clientId: body.clientId,
      recruiterId: payload.sub,
      description: body.description,
      location: body.location,
      remote: body.remote,
      salaryMin: body.salaryMin,
      salaryMax: body.salaryMax,
      contractType: body.contractType ?? 'permanent',
    },
  })

  // Queue AI JD generation if requested
  if (body.generateJD && body.skills?.length) {
    await queues.jdDraft.add('draft', {
      jobId: job.id,
      title: job.title,
      skills: body.skills,
      location: job.location ?? '',
      contractType: job.contractType,
      salaryRange: job.salaryMin ? `${job.salaryMin}–${job.salaryMax ?? '?'} ${job.currency}` : undefined,
    } satisfies JdDraftJob)
  }

  return NextResponse.json(job, { status: 201 })
}, RECRUITER_ROLES)
