import { cookies } from 'next/headers'
import { verifyToken, type TokenPayload } from './auth'

export async function getServerSession(): Promise<TokenPayload | null> {
  const store = await cookies()
  const token = store.get('hr-session')?.value
  if (!token) return null
  return verifyToken(token)
}
