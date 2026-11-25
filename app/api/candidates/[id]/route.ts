import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAuth, RECRUITER_ROLES, ADMIN_ONLY } from '@/lib/rbac'
import { deleteFile, BUCKETS } from '@/lib/minio'

export const GET = withAuth(async (_req, { payload: _ }) => {
  // Handled by dynamic route below
  return NextResponse.json({})
}, RECRUITER_ROLES)

type Params = { params: Promise<{ id: string }> }

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params
  const token = req.cookies.get('hr-session')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { verifyToken } = await import('@/lib/auth')
  const payload = await verifyToken(token)
  if (!payload || !ADMIN_ONLY.includes(payload.role)) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

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
}
