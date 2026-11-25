'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, List, LayoutDashboard, MoreHorizontal, Users, MapPin, Clock } from 'lucide-react'

type Job = {
  id: string
  title: string
  location: string | null
  status: string
  contractType: string
  createdAt: string
  client: { id: string; name: string } | null
  _count: { applications: number }
}

type Stage = 'DRAFT' | 'ACTIVE' | 'CLOSED'

const STAGE_CONFIG: Record<string, { label: string; dot: string; bg: string }> = {
  DRAFT:  { label: 'Draft',  dot: '#9AA6C4', bg: 'rgba(154,166,196,0.08)' },
  ACTIVE: { label: 'Active', dot: '#22d3ee', bg: 'rgba(34,211,238,0.06)' },
  CLOSED: { label: 'Closed', dot: '#22c55e', bg: 'rgba(34,197,94,0.06)' },
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="p-4 rounded-card mb-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      {job.status === 'CLOSED' && (
        <span className="pill pill-warn mb-2" style={{ fontSize: 10, padding: '1px 7px' }}>CLOSED</span>
      )}
      <div style={{ fontWeight: 600, fontSize: 13, color: '#E8ECF5', marginBottom: 6, lineHeight: 1.3 }}>{job.title}</div>
      {job.location && (
        <div style={{ fontSize: 11, color: '#9AA6C4', marginBottom: 2 }}>
          <MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />{job.location}
        </div>
      )}
      <div style={{ fontSize: 11, color: '#9AA6C4', marginBottom: 6 }}>
        <Users size={10} style={{ display: 'inline', marginRight: 3 }} />{job._count.applications} candidates
        &nbsp;·&nbsp;
        <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />{new Date(job.createdAt).toLocaleDateString('en-GB')}
      </div>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 10, color: '#9AA6C4' }}>{job.client?.name ?? '—'}</span>
        <button className="btn-ghost" style={{ padding: '2px 6px' }}><MoreHorizontal size={14} /></button>
      </div>
    </div>
  )
}

export default function JobsPage() {
  const [view, setView] = useState<'board' | 'list'>('board')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(data => { setJobs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const stages: Stage[] = ['DRAFT', 'ACTIVE', 'CLOSED']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: '#E8ECF5', marginBottom: 2 }}>Jobs</h1>
          <p style={{ fontSize: 13, color: '#9AA6C4' }}>Manage and track all your open roles</p>
        </div>
        <button className="btn-gold"><Plus size={15} /> New job</button>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 pill pill-dim" style={{ padding: '4px 6px', gap: 2 }}>
          {(['board', 'list'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: view === v ? 'rgba(200,168,44,0.15)' : 'transparent',
                color: view === v ? '#c8a82c' : '#9AA6C4',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              {v === 'board' ? <><LayoutDashboard size={13} /> Board</> : <><List size={13} /> List</>}
            </button>
          ))}
          <button style={{ padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: 'transparent', color: '#9AA6C4', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Calendar size={13} /> Calendar
          </button>
        </div>
        <span style={{ fontSize: 12, color: '#9AA6C4' }}>
          {loading ? 'Loading…' : `${jobs.length} jobs`}
        </span>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: '#9AA6C4', fontSize: 13 }}>Loading jobs…</div>
      )}

      {!loading && view === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stages.map(stage => {
            const cfg = STAGE_CONFIG[stage]
            const stageJobs = jobs.filter(j => j.status === stage)
            return (
              <div key={stage} style={{ background: cfg.bg, borderRadius: 12, padding: 12 }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#9AA6C4', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {cfg.label}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9AA6C4' }}>{stageJobs.length}</span>
                </div>
                {stageJobs.map(job => <JobCard key={job.id} job={job} />)}
                {stageJobs.length === 0 && (
                  <div style={{ fontSize: 12, color: '#9AA6C4', textAlign: 'center', padding: '12px 0', opacity: 0.6 }}>No jobs</div>
                )}
                <button className="btn-ghost w-full justify-center" style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>
                  <Plus size={13} /> Add job
                </button>
              </div>
            )
          })}
        </div>
      )}

      {!loading && view === 'list' && (
        <div className="rounded-card overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          <table className="compact-table">
            <thead>
              <tr>
                <th>Job title</th><th>Location</th><th>Client</th>
                <th>Candidates</th><th>Created</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#9AA6C4', padding: 24 }}>No jobs yet</td></tr>
              )}
              {jobs.map(job => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 600, color: '#E8ECF5' }}>{job.title}</td>
                  <td>{job.location ?? '—'}</td>
                  <td>{job.client?.name ?? '—'}</td>
                  <td><Users size={12} style={{ display: 'inline', marginRight: 4 }} />{job._count.applications}</td>
                  <td>{new Date(job.createdAt).toLocaleDateString('en-GB')}</td>
                  <td>
                    <span className={`pill ${job.status === 'CLOSED' ? 'pill-ok' : job.status === 'ACTIVE' ? 'pill-cyan' : 'pill-dim'}`}>
                      {STAGE_CONFIG[job.status]?.label ?? job.status}
                    </span>
                  </td>
                  <td><button className="btn-ghost" style={{ padding: '2px 8px', fontSize: 12 }}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
