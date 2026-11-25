import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PROTECTED = ['/dashboard', '/jobs', '/pipeline', '/candidates', '/crm', '/interviews', '/consultants', '/billing', '/settings']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get('hr-session')?.value
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) throw new Error('JWT_SECRET not set')
    const secret = new TextEncoder().encode(jwtSecret)
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    const res = NextResponse.redirect(loginUrl)
    res.cookies.delete('hr-session')
    return res
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/jobs/:path*',
    '/pipeline/:path*',
    '/candidates/:path*',
    '/crm/:path*',
    '/interviews/:path*',
    '/consultants/:path*',
    '/billing/:path*',
    '/settings/:path*',
  ],
}
