import Link from 'next/link'
import { HatLogo } from '@/components/hat-logo'
import { BookOpen, Zap, Users, Briefcase, FileText, CreditCard, Settings, ChevronRight } from 'lucide-react'

const NAV_SECTIONS = [
  {
    label: 'Getting Started',
    icon: Zap,
    items: [
      { href: '/wiki', label: 'Introduction' },
      { href: '/wiki/getting-started/setup', label: 'Platform setup' },
      { href: '/wiki/getting-started/roles', label: 'User roles' },
      { href: '/wiki/getting-started/ai', label: 'Working with AI' },
    ],
  },
  {
    label: 'Win clients',
    icon: Briefcase,
    items: [
      { href: '/wiki/clients/crm', label: 'CRM overview' },
      { href: '/wiki/clients/captain-hook', label: 'Captain Hook' },
      { href: '/wiki/clients/outreach', label: 'AI outreach' },
    ],
  },
  {
    label: 'Recruit',
    icon: Users,
    items: [
      { href: '/wiki/recruit/jobs', label: 'Creating jobs' },
      { href: '/wiki/recruit/matching', label: 'AI matching' },
      { href: '/wiki/recruit/pipeline', label: 'Pipeline' },
      { href: '/wiki/recruit/interviews', label: 'Interviews' },
      { href: '/wiki/recruit/sourcing', label: 'Sourcing' },
    ],
  },
  {
    label: 'Place',
    icon: BookOpen,
    items: [
      { href: '/wiki/place/onboarding', label: 'Onboarding' },
      { href: '/wiki/place/consultant-portal', label: 'Consultant portal' },
      { href: '/wiki/place/contracts', label: 'Contracts' },
    ],
  },
  {
    label: 'Bill & Pay',
    icon: FileText,
    items: [
      { href: '/wiki/bill/timesheets', label: 'Timesheets' },
      { href: '/wiki/bill/invoicing', label: 'Invoicing' },
      { href: '/wiki/bill/payroll', label: 'Payroll' },
    ],
  },
  {
    label: 'Admin',
    icon: Settings,
    items: [
      { href: '/wiki/admin/gdpr', label: 'GDPR tools' },
      { href: '/wiki/admin/kpis', label: 'KPIs & monitoring' },
      { href: '/wiki/admin/api', label: 'API reference' },
    ],
  },
]

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#080f22', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(8,15,34,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <HatLogo size={28} />
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, color: '#E8ECF5' }}>HAT Recruit</span>
            </Link>
            <ChevronRight size={14} style={{ color: '#9AA6C4' }} />
            <span style={{ fontSize: 14, color: '#9AA6C4', fontWeight: 500 }}>Wiki</span>
          </div>
          <Link href="/login" className="btn-gold" style={{ padding: '6px 16px', fontSize: 13 }}>
            Sign In
          </Link>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside
          className="hidden lg:block w-64 flex-shrink-0 py-8 px-4"
          style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          {NAV_SECTIONS.map(({ label, icon: Icon, items }) => (
            <div key={label} className="mb-6">
              <div className="flex items-center gap-2 mb-2 px-3">
                <Icon size={13} style={{ color: '#c8a82c' }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c8a82c' }}>
                  {label}
                </span>
              </div>
              <ul>
                {items.map(({ href, label: lbl }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="btn-ghost"
                      style={{ width: '100%', justifyContent: 'flex-start', fontSize: 13, padding: '5px 12px' }}
                    >
                      {lbl}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 py-10 px-8 max-w-3xl">
          {children}
        </main>
      </div>
    </div>
  )
}
