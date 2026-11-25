import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { withAuth, RECRUITER_ROLES } from '@/lib/rbac'
import type { ApplicationStage } from '@prisma/client'

const MoveStageSchema = z.object({
  applicationId: z.string(),
  toStage: z.enum(['SOURCED','APPLIED','SCREENING','SHORTLISTED','CLIENT_INTERVIEW','OFFER','PLACED','REJECTED','WITHDRAWN']),
  note: z.string().optional(),
})

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get('jobId') ?? undefined

  const applications = await db.application.findMany({
    where: { ...(jobId && { jobId }) },
    include: {
      candidate: {
        select: {
          id: true, firstName: true, lastName: true, currentTitle: true,
          skills: true, location: true, availableFrom: true,
          aiScores: { orderBy: { createdAt: 'desc' }, take: 1, select: { score: true } },
        },
      },
      job: { select: { id: true, title: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(applications)
}, RECRUITER_ROLES)

export const PATCH = withAuth(async (req, { payload }) => {
  const body = MoveStageSchema.parse(await req.json())

  const application = await db.application.findUniqueOrThrow({
    where: { id: body.applicationId },
  })

  const updated = await db.$transaction([
    db.application.update({
      where: { id: body.applicationId },
      data: { stage: body.toStage as ApplicationStage },
    }),
    db.pipelineEvent.create({
      data: {
        applicationId: body.applicationId,
        fromStage: application.stage,
        toStage: body.toStage,
        note: body.note,
        actorId: payload.sub,
      },
    }),
  ])

  return NextResponse.json(updated[0])
}, RECRUITER_ROLES)
