import Link from 'next/link'
import {
  Zap, CheckCircle2, Settings2, DollarSign,
  Handshake, Users, Briefcase, FileText, CreditCard,
  Target, Search, Mic, Anchor, FileSignature, Linkedin,
  Building2, UserCog, UserCheck, User, Smartphone, MessageSquare,
  ChevronRight, ArrowRight, Shield, Globe, Star,
  LayoutDashboard, Calendar, BarChart2, Lock,
} from 'lucide-react'
import { HatLogo } from '@/components/hat-logo'

/* ── Shared sub-components ───────────────────────────────────────────── */

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-hat-muted hover:text-hat-text transition-colors"
    >
      {children}
    </Link>
  )
}

function IconCircle({
  icon: Icon,
  color = 'gold',
  size = 'md',
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  color?: 'gold' | 'cyan' | 'blue'
  size?: 'sm' | 'md' | 'lg'
}) {
  const dim = size === 'lg' ? 56 : size === 'sm' ? 36 : 44
  const iconSize = size === 'lg' ? 24 : size === 'sm' ? 16 : 20
  const bg = {
    gold: 'rgba(200,168,44,0.12)',
    cyan: 'rgba(34,211,238,0.12)',
    blue: 'rgba(99,135,255,0.14)',
  }[color]
  const fg = {
    gold: '#c8a82c',
    cyan: '#22d3ee',
    blue: '#7fb6ff',
  }[color]
  return (
    <div
      style={{ width: dim, height: dim, minWidth: dim, background: bg, borderRadius: '50%' }}
      className="flex items-center justify-center"
    >
      <Icon size={iconSize} style={{ color: fg }} />
    </div>
  )
}

/* ── Nav ─────────────────────────────────────────────────────────────── */

function Nav() {
  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(8,15,34,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <HatLogo size={36} />
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#E8ECF5', letterSpacing: '-0.01em' }}>
            HAT Recruit
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-7">
          <NavLink href="#platform">Platform</NavLink>
          <NavLink href="#agents">AI Agents</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="/wiki">Wiki</NavLink>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-outline" style={{ padding: '7px 18px', fontSize: 13 }}>
            Sign In
          </Link>
          <Link href="/login" className="btn-gold" style={{ padding: '7px 18px', fontSize: 13 }}>
            Request Demo
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ── Hero ────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{
        background: 'radial-gradient(ellipse 100% 80% at 50% -20%, rgba(34,211,238,0.07) 0%, transparent 60%), linear-gradient(180deg, #080f22 0%, #0d1b3e 60%, #080f22 100%)',
        paddingTop: 96,
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative max-w-4xl mx-auto">
        {/* Beta badge */}
        <div className="inline-flex items-center gap-2 pill pill-gold mb-8" style={{ padding: '5px 14px', fontSize: 12 }}>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-DEFAULT inline-block" />
          Now in private beta · Self-hosted &amp; GDPR-ready
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <HatLogo size={72} />
        </div>

        {/* Headline */}
        <h1
          className="font-display text-balance mb-6"
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
            fontWeight: 700,
            lineHeight: 1.12,
            color: '#E8ECF5',
            letterSpacing: '-0.02em',
          }}
        >
          The AI super-intelligence for{' '}
          <span style={{ color: '#c8a82c' }}>recruitment, consulting</span>{' '}
          and manpower companies.
        </h1>

        <p style={{ fontSize: 20, color: '#9AA6C4', marginBottom: 40, lineHeight: 1.6, maxWidth: 580, margin: '0 auto 40px' }}>
          Win clients. Recruit. Place. Bill. Pay. One AI platform that does the heavy lifting — so your team focuses on people and clients.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/login" className="btn-gold" style={{ fontSize: 15, padding: '12px 28px' }}>
            Request a Demo <ArrowRight size={16} />
          </Link>
          <Link href="/login" className="btn-outline" style={{ fontSize: 15, padding: '12px 28px' }}>
            Sign In to Platform
          </Link>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-6" style={{ color: '#9AA6C4', fontSize: 13 }}>
          {[
            { icon: Shield, label: 'GDPR compliant' },
            { icon: Lock, label: 'Runs on your servers' },
            { icon: Globe, label: 'Multi-language' },
            { icon: Star, label: 'AI audit trail' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon size={14} style={{ color: '#c8a82c' }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 flex flex-col items-center gap-1" style={{ color: '#9AA6C4', fontSize: 11, letterSpacing: '0.08em' }}>
        <span className="uppercase">Scroll</span>
        <ChevronRight size={14} style={{ transform: 'rotate(90deg)', opacity: 0.5 }} />
      </div>
    </section>
  )
}

/* ── Why section ─────────────────────────────────────────────────────── */

const WHY_ITEMS = [
  {
    icon: Zap,
    title: 'Productivity',
    desc: 'AI reads the job, scores the CVs, drafts the outreach and writes the interview reports — so each recruiter can handle far more roles.',
  },
  {
    icon: CheckCircle2,
    title: 'Accuracy',
    desc: 'Candidates are judged on real skills and project experience, not job titles. Every score comes with its reasons.',
  },
  {
    icon: Settings2,
    title: 'Efficiency',
    desc: 'Enter data once and it flows from the job to the candidate, the consultant, the invoice and the payroll. No re-typing.',
  },
  {
    icon: DollarSign,
    title: 'Lower costs',
    desc: 'One platform covers CRM, sourcing, interviews, contracts, billing and payroll. Fewer tools to buy, learn and connect.',
  },
]

function WhySection() {
  return (
    <section className="py-24 px-6" style={{ background: '#080f22' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Why HAT Recruit</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', fontWeight: 700, color: '#E8ECF5' }}>
            The brain behind your business
          </h2>
          <p style={{ color: '#9AA6C4', marginTop: 12, fontSize: 17, maxWidth: 600, margin: '12px auto 0' }}>
            It does the heavy lifting, so your team can focus on people and clients.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_ITEMS.map(({ icon, title, desc }) => (
            <div key={title} className="card p-7 flex flex-col gap-5">
              <IconCircle icon={icon} color="gold" />
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#E8ECF5', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#9AA6C4', lineHeight: 1.65 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Platform flow ───────────────────────────────────────────────────── */

const PLATFORM_STEPS = [
  {
    icon: Handshake,
    title: 'Win clients',
    items: ['Captain Hook tender tracking', 'AI-driven CRM and follow-ups'],
  },
  {
    icon: Users,
    title: 'Recruit',
    items: ['AI job intake and matching', 'Talent pool and LinkedIn', 'Pipeline and interviews'],
  },
  {
    icon: Briefcase,
    title: 'Place',
    items: ['Hiring and onboarding', 'Consultant portal and data collection', 'Contracts'],
  },
  {
    icon: FileText,
    title: 'Bill',
    items: ['Billing sheets and margin', 'Timesheets read by AI', 'Compliant cross-border invoicing'],
  },
  {
    icon: CreditCard,
    title: 'Pay',
    items: ['Worldwide payroll', 'Local tax rules applied'],
  },
]

function PlatformSection() {
  return (
    <section id="platform" className="py-24 px-6" style={{ background: '#0d1b3e' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">The Platform</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', fontWeight: 700, color: '#E8ECF5' }}>
            The perfect experience, from end to end
          </h2>
        </div>

        {/* Steps row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {PLATFORM_STEPS.map(({ icon, title, items }, i) => (
            <div key={title} className="relative">
              <div className="card p-6 h-full flex flex-col gap-4">
                <IconCircle icon={icon} color="blue" />
                <h3 style={{ fontWeight: 700, fontSize: 16, color: '#E8ECF5' }}>{title}</h3>
                <ul className="space-y-1.5">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-2" style={{ fontSize: 13, color: '#9AA6C4' }}>
                      <span style={{ color: '#c8a82c', marginTop: 2, flexShrink: 0 }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {i < PLATFORM_STEPS.length - 1 && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-4 h-4">
                  <ChevronRight size={14} style={{ color: '#c8a82c' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Compliance banner */}
        <div
          className="flex items-center gap-4 p-5 rounded-card"
          style={{ background: 'rgba(200,168,44,0.06)', border: '1px solid rgba(200,168,44,0.14)' }}
        >
          <div className="flex-shrink-0">
            <IconCircle icon={Shield} color="gold" size="sm" />
          </div>
          <p style={{ fontSize: 14, color: '#E8ECF5' }}>
            <strong>Across every step:</strong>{' '}
            <span style={{ color: '#9AA6C4' }}>GDPR and compliance, audit trail, KPIs and monitoring, team chat and a built-in toolbox.</span>
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── AI Agents ───────────────────────────────────────────────────────── */

const AGENTS = [
  {
    icon: Target,
    title: 'Matching Agent',
    desc: 'Scores every candidate on real skills, not job titles, and explains strengths and gaps.',
  },
  {
    icon: Search,
    title: 'Sourcing Agent',
    desc: 'Searches your talent pool by meaning and LinkedIn, then ranks who is worth contacting.',
  },
  {
    icon: Mic,
    title: 'Interview Agent',
    desc: 'Prepares your questions, joins the call and assesses the candidate and the interview.',
  },
  {
    icon: Anchor,
    title: 'Captain Hook',
    desc: 'Tracks tenders and market signals for you and tells you where your next client is.',
  },
  {
    icon: FileSignature,
    title: 'Contracts & Compliance',
    desc: 'Prepares and reviews contracts for the right jurisdiction and keeps compliance documents in check.',
  },
  {
    icon: Linkedin,
    title: 'LinkedIn Agent',
    desc: 'Writes your LinkedIn posts and outreach messages in the right tone and language.',
  },
]

function AgentsSection() {
  return (
    <section id="agents" className="py-24 px-6" style={{ background: '#080f22' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">AI Agents</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', fontWeight: 700, color: '#E8ECF5' }}>
            Meet your team of AI agents
          </h2>
          <p style={{ color: '#9AA6C4', marginTop: 12, fontSize: 17, maxWidth: 500, margin: '12px auto 0' }}>
            Specialised agents work on every step, around the clock.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGENTS.map(({ icon, title, desc }) => (
            <div key={title} className="card p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <IconCircle icon={icon} color="cyan" />
                <h3 style={{ fontWeight: 700, fontSize: 16, color: '#E8ECF5' }}>{title}</h3>
              </div>
              <p style={{ fontSize: 14, color: '#9AA6C4', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
        <div
          className="mt-6 flex items-center gap-3 p-5 rounded-card"
          style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.12)' }}
        >
          <CheckCircle2 size={18} style={{ color: '#22d3ee', flexShrink: 0 }} />
          <p style={{ fontSize: 14, color: '#9AA6C4' }}>
            Every AI decision is logged and can be reviewed, approved or overridden by your team.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Features spotlight ──────────────────────────────────────────────── */

function JobsBoardMock() {
  const cols = [
    { label: 'To Do', count: 0, dot: '#9AA6C4', jobs: [] },
    {
      label: 'In Progress', count: 2, dot: '#22d3ee',
      jobs: [
        { title: 'Turnaround Superintendent', cands: 3, loc: 'Ras Laffan, Qatar', due: '15 Nov 2026' },
        { title: 'Corrosion Engineer', cands: 3, loc: 'Mesaieed, Qatar', due: '20 Nov 2026' },
      ],
    },
    {
      label: 'Done', count: 4, dot: '#22c55e',
      jobs: [
        { title: 'Lead Instrument & Control Engineer', cands: 3, loc: 'Ras Laffan, Qatar', due: '6 Nov 2026', expired: true },
        { title: 'Offshore Construction Manager', cands: 3, loc: 'Offshore Fld, Qatar', due: '30 Oct 2026', expired: true },
      ],
    },
  ]
  return (
    <div
      className="rounded-card overflow-hidden"
      style={{ background: '#0d1b3e', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <div className="eyebrow mb-1">AI Powered Opportunities</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#E8ECF5' }}>Jobs</div>
        </div>
        <button className="btn-gold" style={{ padding: '5px 12px', fontSize: 12 }}>+ New job</button>
      </div>
      {/* View toggles */}
      <div className="flex gap-3 px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#9AA6C4' }}>
        <span style={{ color: '#c8a82c', fontWeight: 600 }}>⊞ Board</span>
        <span>≡ List</span>
        <span>📅 Calendar</span>
      </div>
      {/* Columns */}
      <div className="grid grid-cols-3 gap-3 p-4">
        {cols.map(col => (
          <div key={col.label}>
            <div className="flex items-center gap-2 mb-3" style={{ fontSize: 11, fontWeight: 600, color: '#9AA6C4' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: col.dot, display: 'inline-block' }} />
              {col.label.toUpperCase()} · {col.count}
            </div>
            <div className="space-y-2">
              {col.jobs.map(job => (
                <div
                  key={job.title}
                  className="p-3 rounded-card"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {'expired' in job && job.expired && (
                    <span className="pill pill-warn mb-1.5" style={{ fontSize: 10, padding: '1px 6px' }}>EXPIRED</span>
                  )}
                  <div style={{ fontWeight: 600, fontSize: 12, color: '#E8ECF5', marginBottom: 4 }}>{job.title}</div>
                  <div style={{ color: '#9AA6C4', fontSize: 11 }}>👥 {job.cands}  📍 {job.loc}</div>
                  <div style={{ color: '#9AA6C4', fontSize: 11 }}>📅 Due {job.due}</div>
                </div>
              ))}
              {col.jobs.length === 0 && (
                <div style={{ color: '#9AA6C4', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>No jobs here.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PipelineMock() {
  const stages = [
    { label: 'Matching Profiles', count: 1573, candidates: ['Jean-paul Blain', 'Yann Croguennec'] },
    { label: 'Applicants', count: 6, candidates: ['Hassan Al-Thani', 'Maria Sharma'] },
    { label: 'Shortlisted', count: 6, candidates: ['Chen Wei', 'Nikhil Mansour'] },
    { label: 'Client Interview', count: 4, candidates: ['Grace Diallo', 'Pierre Rahman'] },
  ]
  return (
    <div
      className="rounded-card overflow-hidden"
      style={{ background: '#0d1b3e', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12 }}
    >
      <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="eyebrow mb-1">Applicant Tracking</div>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#E8ECF5' }}>Pipeline</div>
        <div style={{ color: '#9AA6C4', fontSize: 12, marginTop: 2 }}>Move candidates through each stage from application to hire.</div>
      </div>
      <div className="flex gap-3 p-4 overflow-x-auto">
        {stages.map(stage => (
          <div key={stage.label} style={{ minWidth: 140 }}>
            <div style={{ fontWeight: 600, fontSize: 11, color: '#9AA6C4', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {stage.label} <span style={{ color: '#E8ECF5' }}>{stage.count}</span>
            </div>
            <div className="space-y-2">
              {stage.candidates.map(name => (
                <div
                  key={name}
                  className="p-2.5 rounded-card"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div style={{ fontWeight: 600, fontSize: 12, color: '#E8ECF5', marginBottom: 3 }}>{name}</div>
                  <div style={{ color: '#9AA6C4', fontSize: 11 }}>Senior Process Safety Engineer</div>
                  <div className="flex gap-1 mt-2">
                    <span className="pill pill-gold" style={{ fontSize: 9, padding: '1px 6px' }}>Shortlisted</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6" style={{ background: '#0d1b3e' }}>
      <div className="max-w-7xl mx-auto space-y-24">

        {/* Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow mb-4">Recruitment</p>
            <h2 className="font-display mb-6" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, color: '#E8ECF5' }}>
              Create a job in seconds
            </h2>
            <div className="space-y-5">
              {[
                { icon: FileText, title: 'Drop in a job description', desc: 'PDF, Word, scan or photo. Title, skills and requirements are filled in for you.' },
                { icon: LayoutDashboard, title: 'Every view you need', desc: 'List, board by stage, or calendar by deadline.' },
                { icon: Calendar, title: 'Never miss a deadline', desc: 'Deadline badges, status and stage tracking on every job.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <IconCircle icon={Icon} color="gold" size="sm" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#E8ECF5', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 14, color: '#9AA6C4', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <JobsBoardMock />
        </div>

        {/* Matching */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className="rounded-card p-6 order-last lg:order-first"
            style={{ background: '#080f22', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="eyebrow mb-3">Matching profiles · 49 sourced</div>
            {[
              { rank: '01', name: 'Laurent Betaillole', score: 91, badge: 'SAFE' },
              { rank: '02', name: 'Joko Susanto', score: 90, badge: 'SAFE' },
              { rank: '03', name: 'Ilyas Mohammed', score: 87, badge: 'REVIEW' },
            ].map(({ rank, name, score, badge }) => (
              <div
                key={name}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: '#9AA6C4', fontSize: 12, width: 20 }}>{rank}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#E8ECF5' }}>{name}</span>
                  <span className={`score-badge ${badge === 'SAFE' ? 'score-high' : 'score-mid'}`}>{badge}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, color: score >= 90 ? '#22c55e' : '#c8a82c' }}>
                  {score}<span style={{ fontSize: 11, color: '#9AA6C4', fontWeight: 400 }}>/100</span>
                </span>
              </div>
            ))}
            <div
              className="mt-4 p-4 rounded-card"
              style={{ background: 'rgba(200,168,44,0.06)', border: '1px solid rgba(200,168,44,0.12)' }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#c8a82c', marginBottom: 4 }}>⚡ Fast Match</div>
              <div style={{ fontSize: 12, color: '#9AA6C4' }}>Drop in any job description and a pile of CVs and get scored results instantly, without even creating a job.</div>
            </div>
          </div>
          <div>
            <p className="eyebrow mb-4">AI Matching and Scoring</p>
            <h2 className="font-display mb-6" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, color: '#E8ECF5' }}>
              Matched on real skills, not job titles
            </h2>
            <div className="space-y-5">
              {[
                { icon: Target, title: 'Scored 0 to 100', desc: 'Every candidate is ranked against the job.' },
                { icon: FileText, title: 'Reasons, not just scores', desc: 'Clear strengths and concerns for each profile.' },
                { icon: Search, title: 'Smart filtering', desc: 'Slightly overqualified profiles are tagged; far over- or under-qualified ones are hidden.' },
                { icon: CheckCircle2, title: 'Fully accountable', desc: 'Recruiters can correct a score; every AI decision is logged.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <IconCircle icon={Icon} color="cyan" size="sm" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#E8ECF5', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 14, color: '#9AA6C4', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow mb-4">Pipeline</p>
            <h2 className="font-display mb-6" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, color: '#E8ECF5' }}>
              A pipeline that runs and updates itself
            </h2>
            <div className="space-y-5">
              {[
                { icon: Zap, title: 'Autonomous', desc: 'The board updates itself. Applicants arrive already scored.' },
                { icon: Settings2, title: 'Full control', desc: 'Drag and drop, reject with a note or restore anytime. Every move is recorded.' },
                { icon: CheckCircle2, title: 'Hire in one click', desc: 'A hired candidate becomes a consultant, notes included.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <IconCircle icon={Icon} color="gold" size="sm" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#E8ECF5', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 14, color: '#9AA6C4', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <PipelineMock />
        </div>
      </div>
    </section>
  )
}

/* ── Roles section ───────────────────────────────────────────────────── */

const ROLES = [
  { icon: Building2, title: 'Owners', desc: 'Full access to every user, every record and all billing, with live KPIs on the whole business.' },
  { icon: UserCog, title: 'Managers', desc: 'Consultants, billing sheets, invoicing and team access, on top of the full recruiter toolkit.' },
  { icon: UserCheck, title: 'Recruiters', desc: 'Jobs, matching, talent pool, pipeline, sourcing, interviews, email and LinkedIn in one workspace.' },
  { icon: User, title: 'Consultants', desc: 'A personal portal for onboarding, timesheets and documents. They see nothing else.' },
  { icon: Smartphone, title: 'Candidates', desc: 'Branded job pages where they apply in a few clicks, from any phone.' },
  { icon: MessageSquare, title: 'Built in for everyone', desc: 'Encrypted team chat, global search, notifications, a toolbox and four languages.' },
]

function RolesSection() {
  return (
    <section className="py-24 px-6" style={{ background: '#080f22' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Every Role</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', fontWeight: 700, color: '#E8ECF5' }}>
            One platform, every role
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ROLES.map(({ icon, title, desc }) => (
            <div key={title} className="card p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <IconCircle icon={icon} color="gold" />
                <h3 style={{ fontWeight: 700, fontSize: 16, color: '#E8ECF5' }}>{title}</h3>
              </div>
              <p style={{ fontSize: 14, color: '#9AA6C4', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── KPI bar ─────────────────────────────────────────────────────────── */

function KpiBar() {
  const kpis = [
    { value: '50%', label: 'faster time-to-hire' },
    { value: '3×', label: 'more candidates screened' },
    { value: '100%', label: 'audit trail on AI' },
    { value: '0', label: 'tools to bolt on' },
  ]
  return (
    <section style={{ background: '#122240', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {kpis.map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="font-display" style={{ fontSize: 36, fontWeight: 700, color: '#c8a82c' }}>{value}</div>
            <div style={{ fontSize: 13, color: '#9AA6C4', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── CTA section ─────────────────────────────────────────────────────── */

function CtaSection() {
  return (
    <section
      className="py-24 px-6 text-center"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,168,44,0.06) 0%, transparent 70%), #0d1b3e',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-2xl mx-auto">
        <HatLogo size={56} className="mx-auto mb-6" />
        <h2 className="font-display mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: '#E8ECF5' }}>
          Ready to transform your recruitment business?
        </h2>
        <p style={{ color: '#9AA6C4', fontSize: 17, marginBottom: 36 }}>
          Win clients. Recruit. Place. Bill. Pay. One AI platform, self-hosted on your infrastructure.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/login" className="btn-gold" style={{ fontSize: 15, padding: '13px 32px' }}>
            Request a Demo <ArrowRight size={16} />
          </Link>
          <Link href="/wiki" className="btn-outline" style={{ fontSize: 15, padding: '13px 32px' }}>
            Read the Wiki
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-6" style={{ fontSize: 13, color: '#9AA6C4' }}>
          <span>contact@hatrecruit.io</span>
          <span>·</span>
          <span>Runs on your servers</span>
          <span>·</span>
          <span>Your data, always</span>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ──────────────────────────────────────────────────────────── */

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: '#080f22', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <HatLogo size={28} />
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, color: '#E8ECF5' }}>HAT Recruit</span>
            </div>
            <p style={{ fontSize: 13, color: '#9AA6C4', lineHeight: 1.6 }}>
              The AI super-intelligence for recruitment, consulting and manpower companies.
            </p>
          </div>
          {[
            { title: 'Platform', links: ['Win clients', 'Recruit', 'Place', 'Bill', 'Pay'] },
            { title: 'Resources', links: ['Wiki', 'API Docs', 'Changelog', 'Status'] },
            { title: 'Company', links: ['About', 'Contact', 'Privacy', 'Terms'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#E8ECF5', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                {title}
              </div>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link}>
                    <Link href="#" style={{ fontSize: 13, color: '#9AA6C4' }} className="hover:text-hat-text transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="flex flex-wrap items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 12, color: '#9AA6C4' }}
        >
          <span>© {year} HAT Recruit. Built on Fredian Shield infrastructure.</span>
          <div className="flex items-center gap-2 pill pill-gold" style={{ padding: '3px 10px' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-DEFAULT inline-block" />
            Powered by local AI · nhomenix01
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 64 }}>
        <Hero />
        <KpiBar />
        <WhySection />
        <PlatformSection />
        <AgentsSection />
        <FeaturesSection />
        <RolesSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
