'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { HatLogo } from '@/components/hat-logo'
import {
  LayoutDashboard, Briefcase, Users, GitBranch,
  Building2, Mic, UserCheck, FileText, Settings,
  Bell, Search, LogOut, ChevronRight,
} from 'lucide-react'

const NAV = [
  { label: 'Overview', items: [{ href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }] },
  {
    label: 'Recruit',
    items: [
      { href: '/jobs', icon: Briefcase, label: 'Jobs' },
      { href: '/candidates', icon: Users, label: 'Candidates' },
      { href: '/pipeline', icon: GitBranch, label: 'Pipeline' },
      { href: '/interviews', icon: Mic, label: 'Interviews' },
    ],
  },
  {
    label: 'Clients',
    items: [
      { href: '/crm', icon: Building2, label: 'CRM' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { href: '/consultants', icon: UserCheck, label: 'Consultants' },
      { href: '/billing', icon: FileText, label: 'Billing' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { href: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: React.ComponentType<{ size?: number; className?: string }>; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '7px 12px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        color: active ? '#E8ECF5' : '#9AA6C4',
        background: active ? 'rgba(200,168,44,0.10)' : 'transparent',
        textDecoration: 'none',
        transition: 'background 0.15s, color 0.15s',
        borderLeft: active ? '2px solid #c8a82c' : '2px solid transparent',
        marginLeft: -2,
      }}
    >
      <Icon size={15} style={{ color: active ? '#c8a82c' : '#9AA6C4', flexShrink: 0 }} />
      {label}
    </Link>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080f22' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          background: '#05091a',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        {/* Logo */}
        <div
          style={{ padding: '18px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <HatLogo size={28} />
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 700, color: '#E8ECF5', lineHeight: 1.1 }}>
              HAT Recruit
            </div>
            <span
              style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                background: 'rgba(200,168,44,0.15)', color: '#c8a82c', borderRadius: 4, padding: '1px 5px',
              }}
            >
              BETA
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {NAV.map(({ label, items }) => (
            <div key={label} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#9AA6C4', padding: '0 12px', marginBottom: 4 }}>
                {label}
              </div>
              {items.map(item => (
                <NavItem key={item.href} {...item} active={pathname === item.href || pathname.startsWith(item.href + '/')} />
              ))}
            </div>
          ))}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(200,168,44,0.20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#c8a82c',
            }}>NM</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#E8ECF5' }}>Neil Manfred</div>
              <div style={{ fontSize: 10, color: '#9AA6C4' }}>Admin</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: 12, color: '#9AA6C4' }}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header
          style={{
            height: 56, background: 'rgba(5,9,26,0.9)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center',
            padding: '0 24px', gap: 12,
            position: 'sticky', top: 0, zIndex: 30,
          }}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={15} style={{ color: '#9AA6C4' }} />
            <input
              type="search"
              placeholder="Search candidates, jobs, clients…"
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: '#E8ECF5', fontSize: 13, width: 280,
              }}
              className="placeholder:text-hat-muted"
            />
          </div>
          <button className="btn-ghost" style={{ padding: '6px 8px', position: 'relative' }}>
            <Bell size={16} />
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 7, height: 7, borderRadius: '50%', background: '#c8a82c',
            }} />
          </button>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
