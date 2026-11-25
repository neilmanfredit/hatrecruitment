import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { withAuth, RECRUITER_ROLES } from '@/lib/rbac'

const CreateCandidateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  location: z.string().optional(),
  currentTitle: z.string().optional(),
  currentEmployer: z.string().optional(),
  skills: z.array(z.string()).default([]),
  availableFrom: z.string().datetime().optional(),
  salaryExpected: z.number().optional(),
  source: z.string().optional(),
  consentGiven: z.boolean().default(false),
})

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const status = searchParams.get('status')

  const candidates = await db.candidate.findMany({
    where: {
      status: status ? (status as never) : { not: 'GDPR_ERASED' },
      ...(q && {
        OR: [
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { currentTitle: { contains: q, mode: 'insensitive' } },
          { skills: { has: q } },
        ],
      }),
    },
    select: {
      id: true, firstName: true, lastName: true, email: true,
      currentTitle: true, currentEmployer: true, skills: true,
      location: true, availableFrom: true, status: true, source: true,
      _count: { select: { applications: true, aiScores: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return NextResponse.json(candidates)
}, RECRUITER_ROLES)

export const POST = withAuth(async (req, { payload }) => {
  const body = CreateCandidateSchema.parse(await req.json())

  const retentionUntil = new Date()
  retentionUntil.setFullYear(retentionUntil.getFullYear() + 2)

  const candidate = await db.candidate.create({
    data: {
      ...body,
      recruiterId: payload.sub,
      availableFrom: body.availableFrom ? new Date(body.availableFrom) : undefined,
      consentAt: body.consentGiven ? new Date() : undefined,
      retentionUntil,
    },
  })
  return NextResponse.json(candidate, { status: 201 })
}, RECRUITER_ROLES)
