'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { HatLogo } from '@/components/hat-logo'
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const from = params.get('from') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        router.push(from)
      } else {
        const data = await res.json()
        setError(data.error ?? 'Invalid credentials')
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,211,238,0.06) 0%, transparent 60%), #080f22',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Back link */}
        <Link href="/" className="btn-ghost mb-8 flex items-center gap-1.5" style={{ fontSize: 13, padding: 0 }}>
          <ArrowLeft size={14} />
          Back to home
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <HatLogo size={56} className="mx-auto mb-4" />
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#E8ECF5', marginBottom: 6 }}>
            HAT Recruit
          </h1>
          <p style={{ fontSize: 14, color: '#9AA6C4' }}>Sign in to your platform</p>
        </div>

        {/* Card */}
        <div
          className="p-8 rounded-card"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingRight: 44 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9AA6C4', padding: 0,
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-card"
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.20)', fontSize: 13, color: '#f87171' }}
              >
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-gold w-full justify-center"
              style={{ width: '100%', padding: '11px', fontSize: 15, marginTop: 4 }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#9AA6C4' }}>
          Don&apos;t have access?{' '}
          <Link href="/#cta" style={{ color: '#c8a82c' }}>Request a demo</Link>
        </p>

        {/* Security note */}
        <div
          className="flex items-center gap-2 mt-8 p-3 rounded-card"
          style={{ background: 'rgba(200,168,44,0.05)', border: '1px solid rgba(200,168,44,0.10)', fontSize: 12, color: '#9AA6C4' }}
        >
          <span style={{ color: '#c8a82c' }}>🔒</span>
          Sessions are encrypted, httpOnly cookies. Your data never leaves your servers.
        </div>
      </div>
    </div>
  )
}
