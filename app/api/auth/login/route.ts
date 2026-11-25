import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, signToken, TOKEN_TTL_SECONDS } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Live mode: multi-user from PostgreSQL
    if (process.env.DATABASE_URL) {
      const user = await db.user.findUnique({ where: { email } })
      if (!user || !user.active) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      const ok = await verifyPassword(password, user.passwordHash)
      if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

      const token = await signToken(user.id, user.email, user.role)
      const res = NextResponse.json({ success: true, role: user.role, name: user.name })
      res.cookies.set('hr-session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: TOKEN_TTL_SECONDS,
        path: '/',
      })
      return res
    }

    // Demo / single-admin fallback
    const validEmail = process.env.ADMIN_EMAIL
    const validHash = process.env.ADMIN_PASSWORD_HASH
    if (!validEmail || !validHash) {
      return NextResponse.json({ error: 'Auth not configured' }, { status: 500 })
    }
    if (email !== validEmail) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const ok = await verifyPassword(password, validHash)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) return NextResponse.json({ error: 'Auth not configured' }, { status: 500 })
    const { SignJWT } = await import('jose')
    const secret = new TextEncoder().encode(jwtSecret)
    const token = await new SignJWT({ email, role: 'ADMIN' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
      .sign(secret)

    const res = NextResponse.json({ success: true, role: 'ADMIN' })
    res.cookies.set('hr-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TOKEN_TTL_SECONDS,
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
