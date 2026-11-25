import { Plus, Search, Building2, Phone, Mail, ArrowRight } from 'lucide-react'

export const metadata = { title: 'CRM — HAT Recruit' }

const CLIENTS = [
  { name: 'TotalEnergies ONE Alpha', contact: 'Pierre Lefebvre', email: 'p.lefebvre@totalenergies.com', jobs: 3, lastContact: 'Today', status: 'active', revenue: '£320k' },
  { name: 'QatarEnergy', contact: 'Mohammed Al-Rashid', email: 'm.alrashid@qatarenergy.qa', jobs: 2, lastContact: 'Yesterday', status: 'active', revenue: '£180k' },
  { name: 'ADNOC Offshore', contact: 'Sarah Mitchell', email: 's.mitchell@adnoc.ae', jobs: 1, lastContact: '3 days ago', status: 'active', revenue: '£95k' },
  { name: 'Shell Nigeria', contact: 'Chukwudi Okafor', email: 'c.okafor@shell.com', jobs: 0, lastContact: '2 weeks ago', status: 'warm', revenue: '—' },
  { name: 'Saipem', contact: 'Marco Ferri', email: 'm.ferri@saipem.com', jobs: 0, lastContact: '1 month ago', status: 'cold', revenue: '—' },
  { name: 'Technip Energies', contact: 'Claire Dupont', email: 'c.dupont@technipenergies.com', jobs: 1, lastContact: '5 days ago', status: 'active', revenue: '£60k' },
]

const STATUS_CONFIG = {
  active: { label: 'Active', cls: 'pill-ok' },
  warm: { label: 'Warm', cls: 'pill-gold' },
  cold: { label: 'Cold', cls: 'pill-dim' },
}

export default function CrmPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, color: '#E8ECF5', marginBottom: 2 }}>CRM</h1>
          <p style={{ fontSize: 13, color: '#9AA6C4' }}>Clients, contacts and AI-driven follow-ups</p>
        </div>
        <button className="btn-gold">
          <Plus size={15} /> New client
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-5">
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9AA6C4' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 32, height: 38, fontSize: 13 }}
            placeholder="Search clients…"
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active clients', value: '4' },
          { label: 'Open jobs', value: '7' },
          { label: 'Billings MTD', value: '£655k' },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4 text-center">
            <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: '#E8ECF5' }}>{value}</div>
            <div style={{ fontSize: 12, color: '#9AA6C4', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Client table */}
      <div
        className="rounded-card overflow-hidden mb-4"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <table className="compact-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Active jobs</th>
              <th>Last contact</th>
              <th>Revenue YTD</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map(c => (
              <tr key={c.name}>
                <td>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                        background: 'rgba(200,168,44,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Building2 size={13} style={{ color: '#c8a82c' }} />
                    </div>
                    <span style={{ fontWeight: 600, color: '#E8ECF5', fontSize: 13 }}>{c.name}</span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 13 }}>{c.contact}</div>
                  <div style={{ fontSize: 11, color: '#9AA6C4', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Mail size={10} />{c.email}
                  </div>
                </td>
                <td>{c.jobs > 0 ? <span style={{ color: '#E8ECF5', fontWeight: 600 }}>{c.jobs}</span> : <span style={{ color: '#9AA6C4' }}>0</span>}</td>
                <td style={{ color: c.lastContact === 'Today' ? '#22c55e' : '#9AA6C4' }}>{c.lastContact}</td>
                <td style={{ fontWeight: 600, color: c.revenue === '—' ? '#9AA6C4' : '#E8ECF5' }}>{c.revenue}</td>
                <td>
                  <span className={`pill ${STATUS_CONFIG[c.status as keyof typeof STATUS_CONFIG].cls}`} style={{ fontSize: 10 }}>
                    {STATUS_CONFIG[c.status as keyof typeof STATUS_CONFIG].label}
                  </span>
                </td>
                <td>
                  <button className="btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }}>
                    Open <ArrowRight size={10} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Captain Hook banner */}
      <div
        className="flex items-start gap-4 p-5 rounded-card"
        style={{ background: 'rgba(200,168,44,0.06)', border: '1px solid rgba(200,168,44,0.14)' }}
      >
        <div style={{ fontSize: 24 }}>⚓</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#E8ECF5', marginBottom: 4 }}>Captain Hook found 2 new tenders this morning</div>
          <div style={{ fontSize: 13, color: '#9AA6C4', marginBottom: 10 }}>
            ADNOC Offshore commissioning (AED 2.1M) · QatarEnergy maintenance TAR (USD 800k)
          </div>
          <button className="btn-gold" style={{ fontSize: 13, padding: '6px 16px' }}>
            Review tenders <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
