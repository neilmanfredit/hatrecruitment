'use client'

import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react'

const STAGES = [
  { id: 'pool', label: 'Matching Profiles', count: 1573 },
  { id: 'applicants', label: 'Applicants', count: 6 },
  { id: 'shortlisted', label: 'Shortlisted', count: 6 },
  { id: 'interview', label: 'Client Interview', count: 4 },
  { id: 'offer', label: 'Offer', count: 2 },
]

const CANDIDATES: Record<string, { name: string; role: string; score?: number; company?: string }[]> = {
  pool: [
    { name: 'Jean-paul Blain', role: 'Commissioning Site Leader', score: 88, company: 'ONE Alpha' },
    { name: 'Yann Croguennec', role: 'Commissioning Leader & Rotating Equip.', score: 84, company: 'ONE Alpha' },
    { name: 'Ilyas Mohammed', role: 'Electrical Commissioning Leader', score: 95, company: 'TOTAL' },
  ],
  applicants: [
    { name: 'Hassan Al-Thani', role: 'Senior Process Safety Engineer', score: 79 },
    { name: 'Maria Sharma', role: 'Planning Engineer (Primavera P6)', score: 72 },
  ],
  shortlisted: [
    { name: 'Chen Wei', role: 'Planning Engineer (Primavera P6)', score: 90 },
    { name: 'Nikhil Mansour', role: 'Senior Process Safety Engineer', score: 85 },
  ],
  interview: [
    { name: 'Grace Diallo', role: 'Senior Process Safety Engineer', score: 91 },
    { name: 'Pierre Rahman', role: 'Turnaround Superintendent', score: 88 },
  ],
  offer: [
    { name: 'Laurent Betaillole', role: 'Commissioning Electrical Lead', score: 91 },
  ],
}

function ScoreBadge({ score }: { score?: number }) {
  if (!score) return null
  const cls = score >= 88 ? 'score-high' : score >= 75 ? 'score-mid' : 'score-low'
  return <span className={`score-badge ${cls}`}>{score}</span>
}

function StageColumn({ stage, candidates }: { stage: typeof STAGES[0]; candidates: typeof CANDIDATES['pool'] }) {
  return (
    <div style={{ minWidth: 200, flex: '0 0 200px' }}>
      <div
        style={{
          fontWeight: 700, fontSize: 11, color: '#9AA6C4', textTransform: 'uppercase',
          letterSpacing: '0.08em', marginBottom: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <span>{stage.label}</span>
        <span style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '1px 7px', fontSize: 10 }}>
          {stage.count}
        </span>
      </div>
      <div className="space-y-2">
        {candidates.map(c => (
          <div
            key={c.name}
            className="card p-3 cursor-grab"
            style={{ cursor: 'grab', userSelect: 'none' }}
          >
            <div style={{ fontWeight: 600, fontSize: 12, color: '#E8ECF5', marginBottom: 2 }}>{c.name}</div>
            {c.company && <div style={{ fontSize: 10, color: '#c8a82c', marginBottom: 4 }}>{c.company}</div>}
            <div style={{ fontSize: 11, color: '#9AA6C4', marginBottom: 6, lineHeight: 1.3 }}>{c.role}</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button className="btn-ghost" style={{ padding: '2px 5px', fontSize: 10 }}>
                  <ChevronLeft size={10} />
                </button>
                <span
                  style={{
                    fontSize: 9, fontWeight: 700, color: '#c8a82c',
                    background: 'rgba(200,168,44,0.12)', borderRadius: 4, padding: '2px 6px',
                  }}
                >
                  {stage.label.toUpperCase()}
                </span>
                <button className="btn-ghost" style={{ padding: '2px 5px', fontSize: 10 }}>
                  <ChevronRight size={10} />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <ScoreBadge score={c.score} />
                <button className="btn-ghost" style={{ padding: '2px 4px' }}>
                  <X size={10} style={{ color: '#9AA6C4' }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PipelinePage() {
  const [jobFilter, setJobFilter] = useState('all')

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: '#E8ECF5', marginBottom: 2 }}>Pipeline</h1>
          <p style={{ fontSize: 13, color: '#9AA6C4' }}>Move candidates through each stage from application to hire.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9AA6C4' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 32, fontSize: 13, height: 36 }}
            placeholder="Search name, role or job…"
          />
        </div>
        <select
          className="form-input"
          style={{ width: 'auto', fontSize: 13, height: 36, padding: '0 10px' }}
          value={jobFilter}
          onChange={e => setJobFilter(e.target.value)}
        >
          <option value="all">All jobs</option>
          <option value="1">Turnaround Superintendent</option>
          <option value="2">Corrosion Engineer</option>
        </select>
        <span style={{ fontSize: 12, color: '#9AA6C4' }}>Drag a card into another column to move it.</span>
      </div>

      {/* Kanban — horizontal scroll on mobile */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          paddingBottom: 16,
        }}
      >
        {STAGES.map(stage => (
          <StageColumn
            key={stage.id}
            stage={stage}
            candidates={CANDIDATES[stage.id] ?? []}
          />
        ))}
      </div>

      <div
        className="mt-4 flex items-center gap-2 p-3 rounded-card"
        style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.10)', fontSize: 12, color: '#9AA6C4' }}
      >
        <span style={{ color: '#22d3ee' }}>✦</span>
        Matching Agent is running in the background — new candidates will appear in Matching Profiles automatically.
      </div>
    </div>
  )
}
