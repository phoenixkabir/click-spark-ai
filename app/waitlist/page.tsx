'use client'

import { useState } from 'react'

const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }

export default function WaitlistPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !name.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), company: company.trim(), role: role.trim() }),
      })
      if (!res.ok) throw new Error('Something went wrong')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(26,24,20,0.15)',
    padding: '10px 0',
    fontFamily: 'var(--font-sans)',
    fontSize: '15px',
    color: 'var(--ink)',
    outline: 'none',
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1a1814', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '6px', textDecoration: 'none' }}>
          <span style={{ color: '#8b2e2e', ...SERIF, fontSize: '18px' }}>◆</span>
          <span style={{ ...SERIF, fontSize: '18px', color: '#1a1814' }}>ClipSpark<span style={{ color: '#8b2e2e' }}>.</span></span>
        </a>
        <a href="/" style={{ ...MONO, color: '#a39c8e', textDecoration: 'none', letterSpacing: '0.18em' }}>← Back</a>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 24px' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {submitted ? (
            <div>
              <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '24px' }}>You're on the list</div>
              <h1 style={{ ...SERIF, fontSize: '52px', lineHeight: 1.05, color: 'var(--ink)', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
                We'll be in touch.
              </h1>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: 'var(--dim)', lineHeight: 1.6, marginBottom: '40px' }}>
                You're among the first to know when ClipSpark AI opens. We're running a closed beta with a small group of brands and agencies — we'll reach out directly.
              </p>
              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '24px' }}>
                <p style={{ ...MONO, color: 'var(--faint)', marginBottom: '16px' }}>While you wait</p>
                <a href="/" style={{ ...MONO, color: 'var(--ink)', textDecoration: 'underline', letterSpacing: '0.18em' }}>
                  Try a free scan →
                </a>
              </div>
            </div>
          ) : (
            <>
              <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '24px' }}>Early access</div>
              <h1 style={{ ...SERIF, fontSize: '52px', lineHeight: 1.05, color: 'var(--ink)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                Be first in.<br />
                <em>Before the feed fills up.</em>
              </h1>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--dim)', lineHeight: 1.6, margin: '0 0 40px' }}>
                ClipSpark AI is in closed beta. We're working with a small group of brands and agencies before we open to everyone. Leave your details and we'll reach out.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '6px' }}>Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '6px' }}>Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@brand.com"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '6px' }}>Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="Brand or agency name"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '6px' }}>Role</label>
                    <input
                      type="text"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      placeholder="e.g. Brand manager"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {error && (
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#c0392b' }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim() || !name.trim()}
                  style={{
                    background: loading || !email.trim() || !name.trim() ? 'var(--faint)' : 'var(--ink)',
                    color: '#fbf7ee',
                    border: 'none',
                    padding: '16px 24px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: loading || !email.trim() || !name.trim() ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.04em',
                    marginTop: '8px',
                  }}
                >
                  {loading ? 'Saving…' : 'Request early access →'}
                </button>

              </form>

              <p style={{ ...MONO, color: 'var(--faint)', marginTop: '20px', lineHeight: 1.6 }}>
                No spam. No pitch deck. Just a message when your spot opens.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
