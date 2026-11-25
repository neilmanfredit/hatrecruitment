import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, type TokenPayload } from './auth'
import type { UserRole } from '@prisma/client'

export type RouteHandler = (req: NextRequest, ctx: { payload: TokenPayload }) => Promise<NextResponse>

export function withAuth(handler: RouteHandler, allowedRoles?: UserRole[]): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const token = req.cookies.get('hr-session')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Session expired' }, { status: 401 })

    if (allowedRoles && !allowedRoles.includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return handler(req, { payload })
  }
}

export const RECRUITER_ROLES: UserRole[] = ['ADMIN', 'MANAGER', 'RECRUITER']
export const MANAGER_ROLES: UserRole[] = ['ADMIN', 'MANAGER']
export const ADMIN_ONLY: UserRole[] = ['ADMIN']
