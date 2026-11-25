import Link from 'next/link'
import { Zap, Users, Briefcase, FileText, CreditCard, Settings, ArrowRight, BookOpen } from 'lucide-react'

export const metadata = { title: 'Wiki — HAT Recruit' }

const SECTIONS = [
  {
    icon: Zap,
    title: 'Getting Started',
    desc: 'Platform setup, user roles and working with AI agents for the first time.',
    color: 'gold',
    href: '/wiki/getting-started/setup',
    articles: ['Platform setup', 'User roles', 'Working with AI', 'First job in 5 minutes'],
  },
  {
    icon: Briefcase,
    title: 'Win Clients',
    desc: 'CRM, Captain Hook tender tracking and AI-driven business development.',
    color: 'cyan',
    href: '/wiki/clients/crm',
    articles: ['CRM overview', 'Captain Hook', 'AI outreach emails', 'Tender tracking'],
  },
  {
    icon: Users,
    title: 'Recruit',
    desc: 'Creating jobs, AI matching and scoring, pipeline management and interviews.',
    color: 'gold',
    href: '/wiki/recruit/jobs',
    articles: ['Creating a job', 'AI matching explained', 'Pipeline stages', 'Interview AI'],
  },
  {
    icon: BookOpen,
    title: 'Place',
    desc: 'Onboarding hired consultants, the consultant portal and contract management.',
    color: 'cyan',
    href: '/wiki/place/onboarding',
    articles: ['Hiring a candidate', 'Consultant portal', 'Document collection', 'Contracts'],
  },
  {
    icon: FileText,
    title: 'Bill',
    desc: 'Timesheet submission, AI reading, invoice generation and cross-border billing.',
    color: 'gold',
    href: '/wiki/bill/timesheets',
    articles: ['Timesheet types', 'AI timesheet reading', 'Invoice formats', 'Margin tracking'],
  },
  {
    icon: Settings,
    title: 'Admin',
    desc: 'GDPR tools, KPI dashboards, team management and API reference.',
    color: 'cyan',
    href: '/wiki/admin/gdpr',
    articles: ['GDPR export & erase', 'Live KPIs', 'AI audit log', 'API reference'],
  },
]

function ColorCircle({ icon: Icon, color }: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color: string }) {
  const bg = color === 'gold' ? 'rgba(200,168,44,0.12)' : 'rgba(34,211,238,0.12)'
  const fg = color === 'gold' ? '#c8a82c' : '#22d3ee'
  return (
    <div style={{ width: 44, height: 44, background: bg, borderRadius: '50%' }} className="flex items-center justify-center">
      <Icon size={20} style={{ color: fg }} />
    </div>
  )
}

export default function WikiHome() {
  return (
    <div>
      <div className="mb-10">
        <p className="eyebrow mb-3">Documentation</p>
        <h1 className="font-display mb-3" style={{ fontSize: 36, fontWeight: 700, color: '#E8ECF5' }}>
          HAT Recruit Wiki
        </h1>
        <p style={{ fontSize: 16, color: '#9AA6C4', lineHeight: 1.7 }}>
          Everything you need to run your recruitment business on HAT Recruit. Find guides for every role — from recruiters and managers through to consultants submitting their first timesheet.
        </p>
      </div>

      {/* Quick start banner */}
      <div
        className="flex items-center gap-4 p-5 rounded-card mb-10"
        style={{ background: 'rgba(200,168,44,0.06)', border: '1px solid rgba(200,168,44,0.14)' }}
      >
        <Zap size={20} style={{ color: '#c8a82c', flexShrink: 0 }} />
        <div className="flex-1">
          <div style={{ fontWeight: 700, fontSize: 15, color: '#E8ECF5', marginBottom: 2 }}>New to HAT Recruit?</div>
          <div style={{ fontSize: 13, color: '#9AA6C4' }}>Start here — platform setup takes under 10 minutes.</div>
        </div>
        <Link href="/wiki/getting-started/setup" className="btn-gold" style={{ padding: '7px 16px', fontSize: 13, flexShrink: 0 }}>
          Get started <ArrowRight size={14} />
        </Link>
      </div>

      {/* Section grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SECTIONS.map(({ icon, title, desc, color, href, articles }) => (
          <div key={title} className="card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <ColorCircle icon={icon} color={color} />
              <h2 style={{ fontWeight: 700, fontSize: 17, color: '#E8ECF5' }}>{title}</h2>
            </div>
            <p style={{ fontSize: 14, color: '#9AA6C4', lineHeight: 1.65 }}>{desc}</p>
            <ul className="space-y-1.5">
              {articles.map(a => (
                <li key={a}>
                  <Link href={href} style={{ fontSize: 13, color: '#9AA6C4' }} className="hover:text-hat-text transition-colors flex items-center gap-1.5">
                    <ArrowRight size={11} style={{ color: '#c8a82c' }} />
                    {a}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={href} className="btn-ghost mt-auto" style={{ width: 'fit-content', fontSize: 13 }}>
              View all →
            </Link>
          </div>
        ))}
      </div>

      {/* API banner */}
      <div
        className="mt-8 p-5 rounded-card flex items-center gap-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Settings size={18} style={{ color: '#9AA6C4', flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#E8ECF5', marginBottom: 2 }}>Developer API</div>
          <div style={{ fontSize: 13, color: '#9AA6C4' }}>
            HAT Recruit exposes a REST API for integrations. See the{' '}
            <Link href="/wiki/admin/api" style={{ color: '#c8a82c' }}>API reference</Link>.
          </div>
        </div>
      </div>
    </div>
  )
}
