import { Search, Filter, Upload, Star } from 'lucide-react'

export const metadata = { title: 'Candidates — HAT Recruit' }

const CANDIDATES = [
  { name: 'Ilyas Mohammed', role: 'Electrical Commissioning Leader', company: 'TOTAL', location: 'Qatar', score: 95, avail: 'Nov 2026', tags: ['OPERCOM', 'ICAPS', 'Offshore'] },
  { name: 'Laurent Betaillole', role: 'Commissioning Electrical Lead', company: 'ONE Alpha', location: 'Qatar', score: 91, avail: 'Dec 2026', tags: ['Offshore', 'O&G', 'HV/LV'] },
  { name: 'Grace Diallo', role: 'Senior Process Safety Engineer', company: 'Shell', location: 'Nigeria', score: 91, avail: 'Immediate', tags: ['PSE', 'HAZOP', 'SIL'] },
  { name: 'Chen Wei', role: 'Planning Engineer', company: 'CPECC', location: 'China', score: 90, avail: 'Jan 2027', tags: ['Primavera P6', 'EPC'] },
  { name: 'Jean-paul Blain', role: 'Commissioning Site Leader', company: 'ONE Alpha', location: 'Qatar', score: 88, avail: 'Dec 2026', tags: ['OPERCOM', 'Commissioning'] },
  { name: 'Pierre Rahman', role: 'Turnaround Superintendent', company: 'TotalEnergies', location: 'UAE', score: 88, avail: 'Feb 2027', tags: ['TAR', 'Maintenance', 'Offshore'] },
  { name: 'Nikhil Mansour', role: 'Senior Process Safety Engineer', company: 'ADNOC', location: 'UAE', score: 85, avail: 'Immediate', tags: ['PSE', 'HAZOP'] },
  { name: 'Yann Croguennec', role: 'Commissioning Leader', company: 'ONE Alpha', location: 'Qatar', score: 84, avail: 'Jan 2027', tags: ['Rotating Equipment', 'OPERCOM'] },
  { name: 'Hassan Al-Thani', role: 'Senior Process Safety Engineer', company: 'QatarEnergy', location: 'Qatar', score: 79, avail: 'Nov 2026', tags: ['PSE', 'Oil & Gas'] },
  { name: 'Maria Sharma', role: 'Planning Engineer (Primavera P6)', company: 'Larsen & Toubro', location: 'India', score: 72, avail: 'Feb 2027', tags: ['Primavera P6', 'EPC'] },
]

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 88 ? 'score-high' : score >= 75 ? 'score-mid' : 'score-low'
  return (
    <span className={`score-badge ${cls}`} style={{ fontSize: 12, padding: '3px 10px' }}>
      {score}
    </span>
  )
}

function AvailBadge({ avail }: { avail: string }) {
  const isImmediate = avail === 'Immediate'
  return (
    <span className={`pill ${isImmediate ? 'pill-ok' : 'pill-dim'}`} style={{ fontSize: 10 }}>
      {avail}
    </span>
  )
}

export default function CandidatesPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: '#E8ECF5', marginBottom: 2 }}>Talent pool</h1>
          <p style={{ fontSize: 13, color: '#9AA6C4' }}>1,573 profiles · searchable by meaning, not keywords</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-outline" style={{ fontSize: 13, padding: '7px 16px' }}>
            <Upload size={14} /> Bulk upload CVs
          </button>
          <button className="btn-gold" style={{ fontSize: 13, padding: '7px 16px' }}>
            + Add candidate
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9AA6C4' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 32, height: 38, fontSize: 13 }}
            placeholder="Search by skill, role, company or location…"
          />
        </div>
        <button className="btn-outline" style={{ fontSize: 13, padding: '7px 14px', height: 38 }}>
          <Filter size={14} /> Filters
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-card overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <table className="compact-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Current role</th>
              <th>Location</th>
              <th>Score</th>
              <th>Availability</th>
              <th>Skills</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {CANDIDATES.map(c => (
              <tr key={c.name}>
                <td>
                  <div style={{ fontWeight: 600, color: '#E8ECF5', fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: '#9AA6C4' }}>{c.company}</div>
                </td>
                <td style={{ maxWidth: 200 }}>
                  <span style={{ fontSize: 13 }}>{c.role}</span>
                </td>
                <td>{c.location}</td>
                <td><ScoreBadge score={c.score} /></td>
                <td><AvailBadge avail={c.avail} /></td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {c.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="pill pill-dim" style={{ fontSize: 10, padding: '2px 7px' }}>{tag}</span>
                    ))}
                    {c.tags.length > 2 && (
                      <span className="pill pill-dim" style={{ fontSize: 10, padding: '2px 7px' }}>+{c.tags.length - 2}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }}>View</button>
                    <button className="btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }}>
                      <Star size={11} />
                    </button>
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
