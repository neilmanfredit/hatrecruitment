import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Briefcase, Users, UserCheck, TrendingUp, Zap, ArrowRight } from 'lucide-react'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/session'

export const metadata = { title: 'Dashboard — HAT Recruit' }

async function getStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [activeJobs, talentPool, placementsMTD, revenueMTD, recentJobs] = await Promise.all([
    db.job.count({ where: { status: 'ACTIVE' } }),
    db.candidate.count({ where: { status: { not: 'GDPR_ERASED' } } }),
    db.application.count({ where: { stage: 'PLACED', updatedAt: { gte: startOfMonth } } }),
    db.invoice.aggregate({
      where: { status: 'paid', issuedAt: { gte: startOfMonth } },
      _sum: { total: true },
    }),
    db.job.findMany({
      where: { status: { in: ['ACTIVE', 'DRAFT'] } },
      include: { client: { select: { name: true } }, _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
  ])

  const revenue = Number(revenueMTD._sum.total ?? 0)
  const revenueStr = revenue >= 1000
    ? `£${(revenue / 1000).toFixed(1)}k`
    : `£${revenue.toFixed(0)}`

  return { activeJobs, talentPool, placementsMTD, revenueStr, recentJobs }
}

function KpiCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  label: string; value: string; sub: string; color: string
}) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} style={{ color }} />
        </div>
        <span style={{ fontSize: 11, color: '#9AA6C4' }}>{sub}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#E8ECF5', fontFamily: 'Playfair Display, serif', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#9AA6C4' }}>{label}</div>
    </div>
  )
}

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session) redirect('/login')

  const { activeJobs, talentPool, placementsMTD, revenueStr, recentJobs } = await getStats()

  const firstName = session.email.split('@')[0].split('.')[0]
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const kpis = [
    { icon: Briefcase, label: 'Active jobs', value: String(activeJobs), sub: 'live roles', color: '#c8a82c' },
    { icon: Users, label: 'Talent pool', value: talentPool.toLocaleString(), sub: 'total profiles', color: '#22d3ee' },
    { icon: UserCheck, label: 'Placements MTD', value: String(placementsMTD), sub: 'this month', color: '#22c55e' },
    { icon: TrendingUp, label: 'Revenue MTD', value: revenueStr, sub: 'invoiced & paid', color: '#c8a82c' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, color: '#E8ECF5', marginBottom: 4 }}>
            Good morning, {displayName}
          </h1>
          <p style={{ fontSize: 14, color: '#9AA6C4' }}>{dateStr}</p>
        </div>
        <Link href="/jobs" className="btn-gold">+ New job</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(kpi => <KpiCard key={kpi.label} {...kpi} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI queue status */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} style={{ color: '#c8a82c' }} />
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#E8ECF5' }}>Getting started</h2>
          </div>
          <div className="space-y-3">
            {[
              { text: 'Upload candidate CVs to start AI scoring', href: '/candidates', cta: 'Add candidates' },
              { text: 'Create your first live job posting', href: '/jobs', cta: 'New job' },
              { text: 'Add your clients to the CRM', href: '/crm', cta: 'Open CRM' },
            ].map(({ text, href, cta }) => (
              <div key={text} className="card p-4 flex items-center gap-4">
                <div style={{ flex: 1, fontSize: 13, color: '#E8ECF5' }}>{text}</div>
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
            {recentJobs.length === 0 && (
              <div className="card p-4" style={{ fontSize: 13, color: '#9AA6C4' }}>No jobs yet — create your first.</div>
            )}
            {recentJobs.map(job => (
              <div key={job.id} className="card p-4">
                <div style={{ fontSize: 13, fontWeight: 600, color: '#E8ECF5', marginBottom: 4 }}>{job.title}</div>
                {job.location && <div style={{ fontSize: 12, color: '#9AA6C4', marginBottom: 8 }}>📍 {job.location}</div>}
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 12, color: '#9AA6C4' }}>👥 {job._count.applications} candidates</span>
                  <span className="pill pill-gold" style={{ fontSize: 10 }}>{job.status}</span>
                </div>
                {job.client && <div style={{ fontSize: 11, color: '#9AA6C4', marginTop: 4 }}>{job.client.name}</div>}
              </div>
            ))}
          </div>
          <Link href="/jobs" className="btn-outline mt-4 w-full justify-center" style={{ marginTop: 12 }}>
            All jobs <ArrowRight size={14} />
          </Link>
        </div>
      </div>

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
