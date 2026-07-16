import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', contact: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    const subject = encodeURIComponent(form.subject || 'Puff Diaries Inquiry')
    const body = encodeURIComponent(`Name: ${form.name}\nContact: ${form.contact}\n\n${form.message}`)
    window.location.href = `mailto:puffdiaries9@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  const CONTACTS = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: 'Call / WhatsApp',
      val: '+977 9842195574',
      href: 'tel:+9779842195574'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: 'Email Support',
      val: 'puffdiaries9@gmail.com',
      href: 'mailto:puffdiaries9@gmail.com'
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      label: 'Instagram DM',
      val: '@puffdiaries_9',
      href: 'https://instagram.com/puffdiaries_9'
    }
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '20px 16px', overflowY: 'auto', paddingBottom: '30px' }}>
        
        {/* Story Intro */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            fontSize: '0.65rem', fontWeight: '750', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--primary)',
            background: 'var(--primary-light)', padding: '4px 10px', borderRadius: '12px'
          }}>
            Support Channels
          </span>
          <h1 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--dark)', marginTop: '12px', lineHeight: '1.25' }}>
            Get in touch with <span style={{ color: 'var(--primary)' }}>our team</span>
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--mid)', marginTop: '8px', lineHeight: '1.5' }}>
            Questions, wholesale pricing requests, or delivery adjustments? We read every DM and message.
          </p>
        </div>

        {/* Quick Contacts grid (stacked list) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {CONTACTS.map((c, i) => (
            <div
              key={i}
              onClick={() => c.href && window.open(c.href)}
              style={{
                background: 'var(--white)', border: '1.5px solid var(--border)',
                borderRadius: '20px', padding: '12px 16px', display: 'flex',
                alignItems: 'center', gap: '14px', cursor: c.href ? 'pointer' : 'default',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'var(--primary-light)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {c.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.62rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--light)', letterSpacing: '0.04em' }}>{c.label}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.val}</div>
              </div>
              {c.href && (
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>→</span>
              )}
            </div>
          ))}
        </div>

        {/* Message form */}
        <div style={{
          background: 'var(--white)', borderRadius: '24px', padding: '16px',
          boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '750', color: 'var(--dark)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            Send Us a Message
          </h3>

          {sent ? (
            <div style={{
              background: '#EBF7F2', border: '1px solid #86efac', borderRadius: '16px',
              padding: '20px 10px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>✓</div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#388E3C' }}>Email Client Triggered</h4>
              <p style={{ fontSize: '0.72rem', color: '#1B5E20', marginTop: '2px', lineHeight: '1.4' }}>
                Your device email client has been loaded with the draft. We'll reply soon!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Your Name</label>
                <input
                  className="input-field" type="text" placeholder="e.g. Prajwal Shrestha"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Email or Phone</label>
                <input
                  className="input-field" type="text" placeholder="e.g. 9842195574"
                  value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
                  required
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Subject</label>
                <input
                  className="input-field" type="text" placeholder="e.g. Wholesale inquiry, order issue"
                  value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div className="input-group" style={{ marginBottom: '10px' }}>
                <label>Message Detail</label>
                <textarea
                  className="input-field" rows="4" placeholder="Enter message contents..."
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  style={{ resize: 'none' }}
                />
              </div>

              <button type="submit" className="primary-btn" style={{ height: '44px' }}>
                Send Message
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}