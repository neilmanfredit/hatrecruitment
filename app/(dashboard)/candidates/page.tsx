'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Upload, Star } from 'lucide-react'

type Candidate = {
  id: string
  firstName: string
  lastName: string
  email: string
  currentTitle: string | null
  currentEmployer: string | null
  skills: string[]
  location: string | null
  availableFrom: string | null
  status: string
  source: string | null
  _count: { applications: number; aiScores: number }
}

function ScoreBadge({ count }: { count: number }) {
  if (count === 0) return <span className="pill pill-dim" style={{ fontSize: 10 }}>No score</span>
  return <span className="score-badge score-mid" style={{ fontSize: 12, padding: '3px 10px' }}>{count} score{count !== 1 ? 's' : ''}</span>
}

function AvailBadge({ date }: { date: string | null }) {
  if (!date) return <span className="pill pill-dim" style={{ fontSize: 10 }}>Unknown</span>
  const d = new Date(date)
  const now = new Date()
  const isImmediate = d <= now
  return (
    <span className={`pill ${isImmediate ? 'pill-ok' : 'pill-dim'}`} style={{ fontSize: 10 }}>
      {isImmediate ? 'Immediate' : d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
    </span>
  )
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  const load = useCallback((search: string) => {
    setLoading(true)
    const url = search ? `/api/candidates?q=${encodeURIComponent(search)}` : '/api/candidates'
    fetch(url)
      .then(r => r.json())
      .then(data => { setCandidates(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load('') }, [load])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    load(q)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: '#E8ECF5', marginBottom: 2 }}>Talent pool</h1>
          <p style={{ fontSize: 13, color: '#9AA6C4' }}>
            {loading ? 'Loading…' : `${candidates.length} profiles`} · searchable by skill, role or company
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn-outline" style={{ fontSize: 13, padding: '7px 16px' }}>
            <Upload size={14} /> Bulk upload CVs
          </button>
          <button className="btn-gold" style={{ fontSize: 13, padding: '7px 16px' }}>+ Add candidate</button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-5">
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9AA6C4' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 32, height: 38, fontSize: 13 }}
            placeholder="Search by skill, role, company or location…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-outline" style={{ fontSize: 13, padding: '7px 14px', height: 38 }}>
          <Filter size={14} /> Search
        </button>
      </form>

      <div className="rounded-card overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        <table className="compact-table">
          <thead>
            <tr>
              <th>Candidate</th><th>Current role</th><th>Location</th>
              <th>AI scores</th><th>Availability</th><th>Skills</th><th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#9AA6C4', padding: 32 }}>Loading candidates…</td></tr>
            )}
            {!loading && candidates.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#9AA6C4', padding: 32 }}>No candidates yet — upload CVs or add manually.</td></tr>
            )}
            {!loading && candidates.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#E8ECF5', fontSize: 13 }}>{c.firstName} {c.lastName}</div>
                  <div style={{ fontSize: 11, color: '#9AA6C4' }}>{c.currentEmployer ?? '—'}</div>
                </td>
                <td style={{ maxWidth: 200 }}><span style={{ fontSize: 13 }}>{c.currentTitle ?? '—'}</span></td>
                <td>{c.location ?? '—'}</td>
                <td><ScoreBadge count={c._count.aiScores} /></td>
                <td><AvailBadge date={c.availableFrom} /></td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {c.skills.slice(0, 2).map(tag => (
                      <span key={tag} className="pill pill-dim" style={{ fontSize: 10, padding: '2px 7px' }}>{tag}</span>
                    ))}
                    {c.skills.length > 2 && (
                      <span className="pill pill-dim" style={{ fontSize: 10, padding: '2px 7px' }}>+{c.skills.length - 2}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }}>View</button>
                    <button className="btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }}><Star size={11} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="mt-4 flex items-center gap-2 p-3 rounded-card"
        style={{ background: 'rgba(200,168,44,0.05)', border: '1px solid rgba(200,168,44,0.10)', fontSize: 12, color: '#9AA6C4' }}
      >
        <span style={{ color: '#c8a82c' }}>⚡</span>
        Fast Match: drop in a job description and a pile of CVs and get scored results instantly, without creating a job.
        <button className="btn-ghost" style={{ fontSize: 12, marginLeft: 'auto' }}>Try it →</button>
      </div>
    </div>
  )
}
