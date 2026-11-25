import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, type TokenPayload } from './auth'
import type { UserRole } from '@prisma/client'

export type RouteContext = { payload: TokenPayload; params: Record<string, string> }
export type RouteHandler = (req: NextRequest, ctx: RouteContext) => Promise<NextResponse>

// Compatible with both static and dynamic Next.js 15 route handlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withAuth(handler: RouteHandler, allowedRoles?: UserRole[]): any {
  return async (req: NextRequest, ctx?: { params?: Promise<Record<string, string>> }) => {
    const token = req.cookies.get('hr-session')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Session expired' }, { status: 401 })

    if (allowedRoles && !allowedRoles.includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const params = ctx?.params ? await ctx.params : {}
    return handler(req, { payload, params })
  }
}

export const RECRUITER_ROLES: UserRole[] = ['ADMIN', 'MANAGER', 'RECRUITER']
export const MANAGER_ROLES: UserRole[] = ['ADMIN', 'MANAGER']
export const ADMIN_ONLY: UserRole[] = ['ADMIN']
