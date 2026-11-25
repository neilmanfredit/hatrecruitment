'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react'

type Application = {
  id: string
  stage: string
  candidate: {
    id: string
    firstName: string
    lastName: string
    currentTitle: string | null
    location: string | null
    aiScores: { score: number }[]
  }
  job: { id: string; title: string }
}

type Job = { id: string; title: string }

const STAGES = [
  { id: 'SOURCED',           label: 'Sourced' },
  { id: 'APPLIED',           label: 'Applied' },
  { id: 'SCREENING',         label: 'Screening' },
  { id: 'SHORTLISTED',       label: 'Shortlisted' },
  { id: 'CLIENT_INTERVIEW',  label: 'Client Interview' },
  { id: 'OFFER',             label: 'Offer' },
]

function ScoreBadge({ score }: { score?: number }) {
  if (score === undefined) return null
  const cls = score >= 88 ? 'score-high' : score >= 75 ? 'score-mid' : 'score-low'
  return <span className={`score-badge ${cls}`}>{score}</span>
}

function StageColumn({
  stage, applications, onMove,
}: {
  stage: typeof STAGES[0]
  applications: Application[]
  onMove: (appId: string, direction: 'prev' | 'next') => void
}) {
  return (
    <div style={{ minWidth: 200, flex: '0 0 200px' }}>
      <div style={{ fontWeight: 700, fontSize: 11, color: '#9AA6C4', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{stage.label}</span>
        <span style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '1px 7px', fontSize: 10 }}>
          {applications.length}
        </span>
      </div>
      <div className="space-y-2">
        {applications.map(app => {
          const score = app.candidate.aiScores[0]?.score
          return (
            <div key={app.id} className="card p-3" style={{ userSelect: 'none' }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: '#E8ECF5', marginBottom: 2 }}>
                {app.candidate.firstName} {app.candidate.lastName}
              </div>
              <div style={{ fontSize: 10, color: '#c8a82c', marginBottom: 4 }}>{app.job.title}</div>
              <div style={{ fontSize: 11, color: '#9AA6C4', marginBottom: 6, lineHeight: 1.3 }}>
                {app.candidate.currentTitle ?? '—'}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    className="btn-ghost"
                    style={{ padding: '2px 5px', fontSize: 10 }}
                    onClick={() => onMove(app.id, 'prev')}
                  ><ChevronLeft size={10} /></button>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#c8a82c', background: 'rgba(200,168,44,0.12)', borderRadius: 4, padding: '2px 6px' }}>
                    {stage.label.toUpperCase()}
                  </span>
                  <button
                    className="btn-ghost"
                    style={{ padding: '2px 5px', fontSize: 10 }}
                    onClick={() => onMove(app.id, 'next')}
                  ><ChevronRight size={10} /></button>
                </div>
                <div className="flex items-center gap-1">
                  <ScoreBadge score={score} />
                  <button className="btn-ghost" style={{ padding: '2px 4px' }}>
                    <X size={10} style={{ color: '#9AA6C4' }} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {applications.length === 0 && (
          <div style={{ fontSize: 11, color: '#9AA6C4', textAlign: 'center', padding: '12px 0', opacity: 0.5 }}>Empty</div>
        )}
      </div>
    </div>
  )
}

export default function PipelinePage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobFilter, setJobFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const loadApplications = useCallback((jid?: string) => {
    const url = jid && jid !== 'all' ? `/api/pipeline?jobId=${jid}` : '/api/pipeline'
    fetch(url)
      .then(r => r.json())
      .then(data => { setApplications(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadApplications()
    fetch('/api/jobs?status=ACTIVE')
      .then(r => r.json())
      .then(data => setJobs(Array.isArray(data) ? data : []))
      .catch(() => null)
  }, [loadApplications])

  const handleMove = async (appId: string, direction: 'prev' | 'next') => {
    const app = applications.find(a => a.id === appId)
    if (!app) return
    const idx = STAGES.findIndex(s => s.id === app.stage)
    const nextIdx = direction === 'next' ? idx + 1 : idx - 1
    if (nextIdx < 0 || nextIdx >= STAGES.length) return

    const toStage = STAGES[nextIdx].id
    await fetch('/api/pipeline', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: appId, toStage }),
    })
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, stage: toStage } : a))
  }

  const filtered = applications.filter(a => jobFilter === 'all' || a.job.id === jobFilter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: '#E8ECF5', marginBottom: 2 }}>Pipeline</h1>
          <p style={{ fontSize: 13, color: '#9AA6C4' }}>
            {loading ? 'Loading…' : `${applications.length} applications`} · move candidates through each stage
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9AA6C4' }} />
          <input className="form-input" style={{ paddingLeft: 32, fontSize: 13, height: 36 }} placeholder="Search name, role or job…" />
        </div>
        <select
          className="form-input"
          style={{ width: 'auto', fontSize: 13, height: 36, padding: '0 10px' }}
          value={jobFilter}
          onChange={e => { setJobFilter(e.target.value); loadApplications(e.target.value) }}
        >
          <option value="all">All jobs</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <span style={{ fontSize: 12, color: '#9AA6C4' }}>Use arrows to move a candidate to the next stage.</span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9AA6C4', fontSize: 13 }}>Loading pipeline…</div>
      ) : (
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
          {STAGES.map(stage => (
            <StageColumn
              key={stage.id}
              stage={stage}
              applications={filtered.filter(a => a.stage === stage.id)}
              onMove={handleMove}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 p-3 rounded-card" style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.10)', fontSize: 12, color: '#9AA6C4' }}>
        <span style={{ color: '#22d3ee' }}>✦</span>
        Matching Agent is running in the background — new candidates will appear in Sourced automatically when CVs are scored.
      </div>
    </div>
  )
}
