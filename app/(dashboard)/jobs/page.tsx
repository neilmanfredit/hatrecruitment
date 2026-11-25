'use client'

import { useState } from 'react'
import { Plus, Calendar, List, LayoutDashboard, MoreHorizontal, Users, MapPin, Clock } from 'lucide-react'

const JOBS = [
  { id: '1', title: 'Turnaround Superintendent', loc: 'Ras Laffan, Qatar', candidates: 23, due: '15 Nov 2026', stage: 'in-progress', client: 'TotalEnergies ONE Alpha' },
  { id: '2', title: 'Corrosion Engineer', loc: 'Mesaieed, Qatar', candidates: 12, due: '20 Nov 2026', stage: 'in-progress', client: 'QatarEnergy' },
  { id: '3', title: 'Lead Instrument & Control Engineer', loc: 'Ras Laffan, Qatar', candidates: 3, due: '6 Nov 2026', stage: 'done', client: 'ADNOC' },
  { id: '4', title: 'Offshore Construction Manager', loc: 'Offshore Fld, Qatar', candidates: 28, due: '30 Oct 2026', stage: 'done', client: 'TotalEnergies' },
  { id: '5', title: 'Process Safety Engineer', loc: 'Abu Dhabi, UAE', candidates: 0, due: '10 Dec 2026', stage: 'todo', client: 'ADNOC Offshore' },
]

const STAGE_CONFIG = {
  todo: { label: 'To Do', dot: '#9AA6C4', bg: 'rgba(154,166,196,0.08)' },
  'in-progress': { label: 'In Progress', dot: '#22d3ee', bg: 'rgba(34,211,238,0.06)' },
  done: { label: 'Done', dot: '#22c55e', bg: 'rgba(34,197,94,0.06)' },
}

function JobCard({ job }: { job: typeof JOBS[0] }) {
  const isExpired = job.stage === 'done'
  return (
    <div
      className="p-4 rounded-card mb-2"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {isExpired && (
        <span className="pill pill-warn mb-2" style={{ fontSize: 10, padding: '1px 7px' }}>CLOSED</span>
      )}
      <div style={{ fontWeight: 600, fontSize: 13, color: '#E8ECF5', marginBottom: 6, lineHeight: 1.3 }}>{job.title}</div>
      <div style={{ fontSize: 11, color: '#9AA6C4', marginBottom: 2 }}>
        <MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />{job.loc}
      </div>
      <div style={{ fontSize: 11, color: '#9AA6C4', marginBottom: 6 }}>
        <Users size={10} style={{ display: 'inline', marginRight: 3 }} />{job.candidates} candidates
        &nbsp;·&nbsp;
        <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />Due {job.due}
      </div>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 10, color: '#9AA6C4' }}>{job.client}</span>
        <button className="btn-ghost" style={{ padding: '2px 6px' }}>
          <MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  )
}

export default function JobsPage() {
  const [view, setView] = useState<'board' | 'list'>('board')

  const stages = ['todo', 'in-progress', 'done'] as const

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: '#E8ECF5', marginBottom: 2 }}>Jobs</h1>
          <p style={{ fontSize: 13, color: '#9AA6C4' }}>Manage and track all your open roles</p>
        </div>
        <button className="btn-gold">
          <Plus size={15} /> New job
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 pill pill-dim" style={{ padding: '4px 6px', gap: 2 }}>
          <button
            onClick={() => setView('board')}
            style={{
              padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              background: view === 'board' ? 'rgba(200,168,44,0.15)' : 'transparent',
              color: view === 'board' ? '#c8a82c' : '#9AA6C4',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <LayoutDashboard size={13} /> Board
          </button>
          <button
            onClick={() => setView('list')}
            style={{
              padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              background: view === 'list' ? 'rgba(200,168,44,0.15)' : 'transparent',
              color: view === 'list' ? '#c8a82c' : '#9AA6C4',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <List size={13} /> List
          </button>
          <button
            style={{
              padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              background: 'transparent', color: '#9AA6C4',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <Calendar size={13} /> Calendar
          </button>
        </div>
        <span style={{ fontSize: 12, color: '#9AA6C4' }}>All jobs · {JOBS.length}</span>
      </div>

      {/* Board view */}
      {view === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stages.map(stage => {
            const cfg = STAGE_CONFIG[stage]
            const stageJobs = JOBS.filter(j => j.stage === stage)
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
                <button
                  className="btn-ghost w-full justify-center"
                  style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}
                >
                  <Plus size={13} /> Add job
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div
          className="rounded-card overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <table className="compact-table">
            <thead>
              <tr>
                <th>Job title</th>
                <th>Location</th>
                <th>Client</th>
                <th>Candidates</th>
                <th>Due</th>
                <th>Stage</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {JOBS.map(job => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 600, color: '#E8ECF5' }}>{job.title}</td>
                  <td>{job.loc}</td>
                  <td>{job.client}</td>
                  <td><Users size={12} style={{ display: 'inline', marginRight: 4 }} />{job.candidates}</td>
                  <td>{job.due}</td>
                  <td>
                    <span className={`pill ${job.stage === 'done' ? 'pill-ok' : job.stage === 'in-progress' ? 'pill-cyan' : 'pill-dim'}`}>
                      {STAGE_CONFIG[job.stage].label}
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
