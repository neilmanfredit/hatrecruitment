import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HAT Recruit — AI-powered recruitment platform',
  description: 'The AI super-intelligence for recruitment, consulting and manpower companies. Win clients. Recruit. Place. Bill. Pay. One AI platform.',
  keywords: 'recruitment, AI, candidate matching, ATS, CRM, payroll, consulting',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
