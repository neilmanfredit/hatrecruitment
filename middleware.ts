import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PROTECTED = ['/dashboard', '/jobs', '/pipeline', '/candidates', '/crm', '/interviews', '/consultants', '/billing', '/settings']
const CANDIDATE_ROUTES = ['/apply', '/my-applications']
const CONSULTANT_ROUTES = ['/my-timesheets', '/my-contracts']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isRecruiterRoute = PROTECTED.some(p => pathname.startsWith(p))
  const isCandidateRoute = CANDIDATE_ROUTES.some(p => pathname.startsWith(p))
  const isConsultantRoute = CONSULTANT_ROUTES.some(p => pathname.startsWith(p))
  if (!isRecruiterRoute && !isCandidateRoute && !isConsultantRoute) return NextResponse.next()

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
    const { payload } = await jwtVerify(token, secret)
    const role = payload.role as string | undefined

    // Role-based route guard
    if (isRecruiterRoute && role === 'CANDIDATE') {
      return NextResponse.redirect(new URL('/my-applications', request.url))
    }
    if (isCandidateRoute && role && !['CANDIDATE', 'ADMIN'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (isConsultantRoute && role && !['CONSULTANT', 'ADMIN'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

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
    '/apply/:path*',
    '/my-applications/:path*',
    '/my-timesheets/:path*',
    '/my-contracts/:path*',
  ],
}
