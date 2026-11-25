import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { signToken, revokeToken, TOKEN_TTL_SECONDS } from '@/lib/auth'
import type { TokenPayload } from '@/lib/auth'

const REFRESH_THRESHOLD = 15 * 60 // refresh when < 15 min remaining

function getSecret() {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET not set')
  return new TextEncoder().encode(s)
}

export async function POST(req: Request) {
  try {
    const token = (req as unknown as { cookies: { get: (k: string) => { value: string } | undefined } })
      .cookies.get('hr-session')?.value

    if (!token) return NextResponse.json({ error: 'No session' }, { status: 401 })

    const { payload } = await jwtVerify(token, getSecret())
    const exp = payload.exp as number | undefined
    if (!exp) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const remaining = exp - Math.floor(Date.now() / 1000)
    if (remaining > REFRESH_THRESHOLD) {
      return new NextResponse(null, { status: 204 })
    }

    // Issue new token and revoke old
    const p = payload as unknown as TokenPayload
    const newToken = await signToken(p.sub, p.email, p.role)
    if (p.jti) await revokeToken(p.jti)

    const res = new NextResponse(null, { status: 204 })
    res.cookies.set('hr-session', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TOKEN_TTL_SECONDS,
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
