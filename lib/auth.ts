import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { db } from './db'
import type { UserRole } from '@prisma/client'

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET not set')
  return new TextEncoder().encode(s)
}

export const TOKEN_TTL_SECONDS = 60 * 60 // 1 hour

export interface TokenPayload {
  sub: string   // userId
  email: string
  role: UserRole
  jti: string
}

export async function signToken(userId: string, email: string, role: UserRole): Promise<string> {
  const jti = randomUUID()
  const expiresAt = new Date(Date.now() + TOKEN_TTL_SECONDS * 1000)

  await db.session.create({ data: { userId, jti, expiresAt } })

  return new SignJWT({ email, role } satisfies Omit<TokenPayload, 'sub' | 'jti'>)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    const jti = payload.jti as string

    // Check session not revoked
    const session = await db.session.findUnique({ where: { jti } })
    if (!session || session.revoked || session.expiresAt < new Date()) return null

    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export async function revokeToken(jti: string): Promise<void> {
  await db.session.updateMany({ where: { jti }, data: { revoked: true } })
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
