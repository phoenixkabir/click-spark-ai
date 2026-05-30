'use client'

import { useState } from 'react'

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }
const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }

type ContentType = 'linkedin' | 'youtube' | 'seo'

interface GeneratedContent {
  linkedin?: string
  youtube?: string
  seo?: string
}

const CALENDAR = [
  { day: 'Mon 26', items: [{ type: 'LinkedIn', title: 'Why boring water is a $4B market', status: 'LIVE' }, { type: 'SEO', title: 'Best canned water brands 2026', status: 'LIVE' }] },
  { day: 'Tue 27', items: [{ type: 'LinkedIn', title: 'The Liquid Death brand playbook', status: 'LIVE' }] },
  { day: 'Wed 28', items: [{ type: 'YouTube', title: 'How we built a water company worth $1.4B', status: 'SCHEDULED' }, { type: 'LinkedIn', title: 'What punk rock taught us about marketing', status: 'SCHEDULED' }] },
  { day: 'Thu 29', items: [{ type: 'SEO', title: 'Alternative energy drinks that aren\'t bad for you', status: 'DRAFT' }] },
  { day: 'Fri 30', items: [{ type: 'LinkedIn', title: 'The distribution playbook nobody talks about', status: 'DRAFT' }, { type: 'YouTube', title: 'Behind the scenes: filming a Liquid Death ad', status: 'DRAFT' }] },
]

export default function OrganicEnginePage() {
  const [brief, setBrief] = useState('')
  const [activeTab, setActiveTab] = useState<ContentType>('linkedin')
  const [content, setContent] = useState<GeneratedContent>({})
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<ContentType | null>(null)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!brief.trim()) return
    setGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief: brief.trim(), type: activeTab }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Generation failed')
      const data = await res.json()
      setContent(prev => ({ ...prev, [activeTab]: data.content }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  function handleCopy(type: ContentType) {
    const text = content[type]
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid #1a1814',
        padding: '16px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/dashboard" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none' }}>← Dashboard</a>
          <span style={{ ...MONO, color: 'var(--faint)' }}>/</span>
          <span style={{ ...MONO, color: '#a39c8e' }}>Content Engine</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="/dashboard/paid" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none' }}>Paid →</a>
          <a href="/dashboard/ugc" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none' }}>UGC →</a>
        </div>
      </nav>

      <div style={{ padding: '48px 40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ ...MONO, color: '#a39c8e', marginBottom: '8px' }}>03 · Content Engine</div>
          <h1 style={{ ...SERIF, fontSize: '52px', lineHeight: 1, color: '#1a1814', margin: '0 0 8px' }}>
            Win Forever.
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--dim)', maxWidth: '560px', lineHeight: 1.6, margin: 0 }}>
            Owned content that compounds. One brand brief generates LinkedIn posts, YouTube scripts, and SEO articles — all scored before they publish. The audience you build here makes every future ad cheaper to run.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'start' }}>

          {/* Content generator */}
          <div>
            {/* Tab bar */}
            <div style={{ display: 'flex', borderBottom: '2px solid #1a1814', marginBottom: '24px' }}>
              {([['linkedin', 'LinkedIn'], ['youtube', 'YouTube'], ['seo', 'SEO Article']] as [ContentType, string][]).map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  style={{
                    ...MONO,
                    padding: '12px 20px',
                    background: 'transparent', border: 'none',
                    borderBottom: activeTab === type ? '2px solid #8b2e2e' : '2px solid transparent',
                    marginBottom: '-2px',
                    color: activeTab === type ? '#8b2e2e' : 'var(--faint)',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Brief input */}
            <form onSubmit={handleGenerate} style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>
                  {activeTab === 'linkedin' && 'Topic or angle for the LinkedIn post'}
                  {activeTab === 'youtube' && 'Video topic and key points to cover'}
                  {activeTab === 'seo' && 'Target keyword or article topic'}
                </label>
                <textarea
                  value={brief}
                  onChange={e => setBrief(e.target.value)}
                  placeholder={
                    activeTab === 'linkedin'
                      ? 'e.g. Why boring branding is killing D2C companies — our take on standing out in a commoditized market'
                      : activeTab === 'youtube'
                      ? 'e.g. The Liquid Death marketing playbook — how we built a $1B water brand using punk aesthetics and anti-corporate positioning'
                      : 'e.g. best canned water brands 2026 — comparison article targeting purchase-intent search'
                  }
                  rows={5}
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'transparent',
                    border: '1px solid rgba(26,24,20,0.15)',
                    borderTop: '2px solid #1a1814',
                    padding: '14px',
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    color: 'var(--ink)', outline: 'none',
                    resize: 'vertical', lineHeight: 1.6,
                  }}
                />
              </div>

              {error && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#c0392b', marginBottom: '12px' }}>{error}</p>}

              <button
                type="submit"
                disabled={generating || !brief.trim()}
                style={{
                  background: generating || !brief.trim() ? 'var(--faint)' : '#1a1814',
                  color: '#fbf7ee', border: 'none', padding: '12px 24px',
                  fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
                  cursor: generating || !brief.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {generating
                  ? `Generating ${activeTab === 'linkedin' ? 'post' : activeTab === 'youtube' ? 'script' : 'article'}…`
                  : `Generate ${activeTab === 'linkedin' ? 'LinkedIn post' : activeTab === 'youtube' ? 'YouTube script' : 'SEO article'} →`}
              </button>
            </form>

            {/* Content output */}
            {content[activeTab] ? (
              <div style={{ border: '1px solid var(--rule)', borderTop: '2px solid #a39c8e', background: 'var(--paper)', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ ...MONO, color: '#a39c8e' }}>
                    {activeTab === 'linkedin' ? 'LinkedIn Post' : activeTab === 'youtube' ? 'YouTube Script' : 'SEO Article'}
                  </div>
                  <button
                    onClick={() => handleCopy(activeTab)}
                    style={{ ...MONO, color: copied === activeTab ? '#8b2e2e' : 'var(--dim)', background: 'transparent', border: '1px solid var(--rule)', padding: '6px 12px', cursor: 'pointer' }}
                  >
                    {copied === activeTab ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div style={{
                  fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--ink)',
                  lineHeight: 1.7, whiteSpace: 'pre-wrap', maxHeight: '600px', overflowY: 'auto',
                }}>
                  {content[activeTab]}
                </div>
                <div style={{ marginTop: '16px', borderTop: '1px solid var(--rule)', paddingTop: '12px', display: 'flex', gap: '12px' }}>
                  <button style={{ ...MONO, color: '#fbf7ee', background: '#a39c8e', border: 'none', padding: '8px 14px', cursor: 'pointer' }}>
                    Schedule →
                  </button>
                  <a
                    href={`/score?prefill=${encodeURIComponent(content[activeTab]?.slice(0, 200) || '')}`}
                    style={{ ...MONO, color: 'var(--dim)', background: 'transparent', border: '1px solid var(--rule)', padding: '8px 14px', textDecoration: 'none' }}
                  >
                    Score with brain model →
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ border: '1px dashed rgba(26,24,20,0.15)', padding: '40px', textAlign: 'center' }}>
                <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '8px' }}>
                  {activeTab === 'linkedin' ? 'LinkedIn post' : activeTab === 'youtube' ? 'YouTube script' : 'SEO article'} will appear here
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)' }}>
                  {activeTab === 'linkedin' && '~400 words · 5 angles · hook designed to stop the scroll'}
                  {activeTab === 'youtube' && 'Full script · intro → hook → value → CTA · 8–12 min format'}
                  {activeTab === 'seo' && '~800 words · keyword-optimized · H2 structure · meta description included'}
                </p>
              </div>
            )}
          </div>

          {/* Content calendar */}
          <div>
            <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '16px' }}>Content calendar · May 2026</div>
            <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
              {CALENDAR.map(({ day, items }, i) => (
                <div key={day} style={{ borderBottom: i < CALENDAR.length - 1 ? '1px solid var(--rule)' : 'none', padding: '14px 16px' }}>
                  <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '8px' }}>{day}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {items.map(({ type, title, status }) => (
                      <div key={title} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{
                          ...MONO, fontSize: '9px',
                          padding: '2px 6px',
                          background: type === 'LinkedIn' ? '#0077b5' : type === 'YouTube' ? '#ff0000' : '#1a1814',
                          color: '#fff',
                          whiteSpace: 'nowrap', flexShrink: 0,
                        }}>{type}</span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: status === 'LIVE' ? '#1a1814' : status === 'SCHEDULED' ? '#6a6258' : 'var(--faint)', lineHeight: 1.4 }}>{title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ marginTop: '20px', border: '1px solid var(--rule)', padding: '20px', background: 'var(--paper)' }}>
              <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '12px' }}>This month</div>
              {[['28', 'pieces published'], ['12K', 'total organic reach'], ['4.2K', 'LinkedIn impressions'], ['3.1K', 'SEO sessions']].map(([v, l]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--rule)' }}>
                  <span style={{ ...MONO, color: 'var(--faint)' }}>{l}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#1a1814', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
