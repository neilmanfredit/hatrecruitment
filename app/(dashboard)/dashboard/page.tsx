import Link from 'next/link'
import { Briefcase, Users, UserCheck, TrendingUp, Zap, ArrowRight, CheckCircle2, Clock } from 'lucide-react'

export const metadata = { title: 'Dashboard — HAT Recruit' }

const KPIS = [
  { icon: Briefcase, label: 'Active jobs', value: '12', trend: '+3 this week', color: '#c8a82c' },
  { icon: Users, label: 'Talent pool', value: '1,573', trend: '+48 this month', color: '#22d3ee' },
  { icon: UserCheck, label: 'Placements MTD', value: '8', trend: 'Target: 10', color: '#22c55e' },
  { icon: TrendingUp, label: 'Revenue MTD', value: '£142.5k', trend: '+12% vs last month', color: '#c8a82c' },
]

const TODAY_ACTIONS = [
  { type: 'match', text: 'Matching Agent found 23 new candidates for Turnaround Superintendent', time: '2 min ago', cta: 'Review', href: '/pipeline' },
  { type: 'interview', text: 'Interview report ready: Chen Wei — Planning Engineer', time: '45 min ago', cta: 'Read report', href: '/interviews' },
  { type: 'invoice', text: 'Captain Hook: New tender — ADNOC offshore commissioning (AED 2.1M)', time: '1 hr ago', cta: 'View', href: '/crm' },
  { type: 'timesheet', text: 'Hassan Al-Thani submitted August timesheet — ready to approve', time: '2 hr ago', cta: 'Approve', href: '/billing' },
]

const RECENT_JOBS = [
  { title: 'Turnaround Superintendent', loc: 'Ras Laffan, Qatar', candidates: 23, stage: 'In Progress', due: 'Nov 15' },
  { title: 'Corrosion Engineer', loc: 'Mesaieed, Qatar', candidates: 12, stage: 'In Progress', due: 'Nov 20' },
  { title: 'Lead Instrument & Control Engineer', loc: 'Ras Laffan, Qatar', candidates: 3, stage: 'Done', due: 'Nov 6' },
]

function KpiCard({ icon: Icon, label, value, trend, color }: typeof KPIS[0]) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div
          style={{ width: 40, height: 40, borderRadius: '50%', background: `${color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <span style={{ fontSize: 11, color: '#9AA6C4' }}>{trend}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#E8ECF5', fontFamily: 'Playfair Display, serif', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#9AA6C4' }}>{label}</div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, color: '#E8ECF5', marginBottom: 4 }}>
            Good morning, Neil
          </h1>
          <p style={{ fontSize: 14, color: '#9AA6C4' }}>Wednesday 25 November 2026 · 7 AI actions waiting</p>
        </div>
        <Link href="/jobs" className="btn-gold">
          + New job
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPIS.map(kpi => <KpiCard key={kpi.label} {...kpi} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's AI actions */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} style={{ color: '#c8a82c' }} />
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#E8ECF5' }}>Today&apos;s AI actions</h2>
          </div>
          <div className="space-y-3">
            {TODAY_ACTIONS.map(({ type, text, time, cta, href }) => (
              <div key={text} className="card p-4 flex items-start gap-4">
                <div
                  style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: type === 'match' ? 'rgba(34,211,238,0.12)' : type === 'interview' ? 'rgba(200,168,44,0.12)' : 'rgba(34,197,94,0.10)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {type === 'match' && <Users size={14} style={{ color: '#22d3ee' }} />}
                  {type === 'interview' && <CheckCircle2 size={14} style={{ color: '#c8a82c' }} />}
                  {type === 'invoice' && <TrendingUp size={14} style={{ color: '#22c55e' }} />}
                  {type === 'timesheet' && <Clock size={14} style={{ color: '#9AA6C4' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: '#E8ECF5', lineHeight: 1.5, marginBottom: 4 }}>{text}</p>
                  <p style={{ fontSize: 11, color: '#9AA6C4' }}>{time}</p>
                </div>
                <Link href={href} className="btn-ghost" style={{ fontSize: 12, flexShrink: 0 }}>
                  {cta} <ArrowRight size={11} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#E8ECF5' }}>Recent jobs</h2>
            <Link href="/jobs" className="btn-ghost" style={{ fontSize: 12 }}>View all</Link>
          </div>
          <div className="space-y-3">
            {RECENT_JOBS.map(job => (
              <div key={job.title} className="card p-4">
                <div style={{ fontSize: 13, fontWeight: 600, color: '#E8ECF5', marginBottom: 4 }}>{job.title}</div>
                <div style={{ fontSize: 12, color: '#9AA6C4', marginBottom: 8 }}>📍 {job.loc}</div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 12, color: '#9AA6C4' }}>👥 {job.candidates} candidates</span>
                  <span
                    className={`pill ${job.stage === 'Done' ? 'pill-ok' : 'pill-gold'}`}
                    style={{ fontSize: 10 }}
                  >
                    {job.stage}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#9AA6C4', marginTop: 4 }}>📅 Due {job.due}</div>
              </div>
            ))}
          </div>
          <Link href="/jobs" className="btn-outline mt-4 w-full justify-center" style={{ marginTop: 12 }}>
            All jobs <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* AI usage note */}
      <div
        className="mt-6 flex items-center gap-3 p-4 rounded-card"
        style={{ background: 'rgba(200,168,44,0.05)', border: '1px solid rgba(200,168,44,0.10)', fontSize: 12, color: '#9AA6C4' }}
      >
        <span style={{ color: '#c8a82c' }}>🤖</span>
        <span>Running on <strong style={{ color: '#E8ECF5' }}>qwen2.5-coder:32b</strong> via local Ollama (nhomenix01) · All AI processing stays on your infrastructure</span>
      </div>
    </div>
  )
}
