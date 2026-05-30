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

const PIPELINE_STAGES = [
  {
    num: '01',
    label: 'Brand Brief',
    status: 'live' as const,
    model: 'Data Layer',
    desc: 'Your brand context — tone, audience, positioning — is pulled automatically from the shared data layer. No re-briefing per piece.',
  },
  {
    num: '02',
    label: 'Topic + Format',
    status: 'live' as const,
    model: 'You',
    desc: 'Pick a format (LinkedIn, YouTube, SEO) and give the angle or keyword. The engine handles the rest.',
  },
  {
    num: '03',
    label: 'Content Generation',
    status: 'live' as const,
    model: 'Smart scripting',
    desc: 'Format-specific content written in your brand voice. LinkedIn posts, full YouTube scripts, SEO articles with H2 structure and meta descriptions.',
  },
  {
    num: '04',
    label: 'Brain Score',
    status: 'live' as const,
    model: 'Neuro-scoring',
    desc: 'Every piece is scored across Reward, Attention, Emotion, and Memory before it goes out. Weak hooks get flagged before they waste reach.',
  },
  {
    num: '05',
    label: 'Schedule & Publish',
    status: 'waitlist' as const,
    model: 'One-click distribution',
    desc: 'Auto-post to LinkedIn, publish YouTube videos, push SEO articles directly to your CMS. One click from generation to live.',
  },
]

const CALENDAR = [
  { day: 'Mon 26', items: [{ type: 'LinkedIn', title: 'Why boring branding is killing D2C companies', status: 'LIVE' }, { type: 'SEO', title: 'Best canned water brands 2026', status: 'LIVE' }] },
  { day: 'Tue 27', items: [{ type: 'LinkedIn', title: 'The brand playbook nobody teaches', status: 'LIVE' }] },
  { day: 'Wed 28', items: [{ type: 'YouTube', title: 'How we built a $1B brand in 4 years', status: 'SCHEDULED' }, { type: 'LinkedIn', title: 'What punk rock taught us about marketing', status: 'SCHEDULED' }] },
  { day: 'Thu 29', items: [{ type: 'SEO', title: 'Alternative energy drinks that aren\'t bad for you', status: 'DRAFT' }] },
  { day: 'Fri 30', items: [{ type: 'LinkedIn', title: 'The distribution playbook nobody talks about', status: 'DRAFT' }, { type: 'YouTube', title: 'Behind the scenes: filming a brand ad', status: 'DRAFT' }] },
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
          <a href="/dashboard/paid" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none', padding: '8px 0', minHeight: '44px', display: 'flex', alignItems: 'center' }}>Paid →</a>
          <a href="/dashboard/ugc" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none', padding: '8px 0', minHeight: '44px', display: 'flex', alignItems: 'center' }}>UGC →</a>
        </div>
      </nav>

      <div style={{ padding: '48px 40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ ...MONO, color: '#a39c8e', marginBottom: '8px' }}>03 · Content Engine</div>
          <h1 style={{ ...SERIF, fontSize: '52px', lineHeight: 1, color: '#1a1814', margin: '0 0 12px' }}>
            Win Forever.
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--dim)', maxWidth: '560px', lineHeight: 1.6, margin: 0 }}>
            Owned content that compounds. One brand brief generates LinkedIn posts, YouTube scripts, and SEO articles — all in your voice, all brain-scored before they publish. The audience you build here makes every future ad cheaper to run.
          </p>
        </div>

        {/* Pipeline stages */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <div style={{ ...MONO, color: 'var(--faint)' }}>How the content engine works</div>
            <div style={{ ...MONO, color: 'var(--faint)', fontSize: '9px' }}>Brief → topic → generate → score → publish</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(160px, 1fr))', gap: '0', border: '1px solid var(--rule)', overflowX: 'auto' }}>
            {PIPELINE_STAGES.map((stage, i) => {
              const isLive = stage.status === 'live'
              return (
                <div
                  key={stage.num}
                  style={{
                    borderRight: i < 4 ? '1px solid var(--rule)' : 'none',
                    borderTop: `3px solid ${isLive ? '#a39c8e' : 'rgba(26,24,20,0.10)'}`,
                    padding: '20px',
                    background: isLive ? 'var(--paper)' : '#f8f4ec',
                    position: 'relative' as const,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ ...MONO, color: isLive ? '#a39c8e' : 'var(--faint)' }}>{stage.num}</div>
                    <span style={{
                      ...MONO, fontSize: '8px', padding: '2px 6px',
                      background: isLive ? '#a39c8e' : 'transparent',
                      color: isLive ? '#fbf7ee' : 'var(--faint)',
                      border: isLive ? 'none' : '1px solid var(--rule)',
                    }}>
                      {isLive ? 'Live' : 'Soon'}
                    </span>
                  </div>
                  <div style={{ ...MONO, color: isLive ? '#1a1814' : 'var(--faint)', marginBottom: '8px', fontSize: '10px' }}>
                    {stage.label}
                  </div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: isLive ? 'var(--dim)' : 'var(--faint)', lineHeight: 1.5, margin: '0 0 12px' }}>
                    {stage.desc}
                  </p>
                  <div style={{ ...MONO, fontSize: '9px', color: isLive ? '#a39c8e' : 'var(--faint)', borderTop: '1px solid var(--rule)', paddingTop: '8px' }}>
                    {stage.model}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Stage 05 waitlist bar */}
          <div style={{
            background: '#1a1814', padding: '14px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ ...MONO, color: '#a39c8e', fontSize: '9px' }}>Stage 05 · Auto-publish</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(251,247,238,0.7)' }}>
                One-click from generated content to live post · LinkedIn, YouTube, CMS
              </span>
            </div>
            <a
              href="/waitlist"
              style={{
                ...MONO, color: '#fbf7ee', background: '#8b2e2e',
                padding: '8px 16px', textDecoration: 'none', flexShrink: 0,
              }}
            >
              Join the waitlist →
            </a>
          </div>
        </div>

        {/* How it differs — 3 pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', marginBottom: '40px', border: '1px solid var(--rule)' }}>
          {[
            {
              icon: '◆',
              label: 'Brand voice, not generic AI',
              desc: 'Every piece is written with your brief — tone, audience, positioning — already loaded. It sounds like your brand, not a prompt template.',
            },
            {
              icon: '◆',
              label: 'Scored before it goes out',
              desc: 'Brain model scores each piece across Reward, Attention, Emotion, Memory. Weak hooks get flagged. You only publish content that\'s built to stick.',
            },
            {
              icon: '◆',
              label: 'Compounds with paid',
              desc: 'Organic content builds the audience that makes your paid ads cheaper. The flywheel: content builds trust → trust lowers CPM → lower CPM funds more content.',
            },
          ].map((p, i) => (
            <div
              key={p.label}
              style={{
                padding: '20px 24px',
                borderRight: i < 2 ? '1px solid var(--rule)' : 'none',
                background: 'var(--paper)',
              }}
            >
              <div style={{ ...MONO, color: '#a39c8e', marginBottom: '8px' }}>{p.icon} {p.label}</div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Main grid — generator + calendar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'start' }}>

          {/* Content generator */}
          <div>
            <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '16px' }}>Stage 01–04 · Live now</div>

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
                    borderBottom: activeTab === type ? '2px solid #a39c8e' : '2px solid transparent',
                    marginBottom: '-2px',
                    color: activeTab === type ? '#a39c8e' : 'var(--faint)',
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
                <label htmlFor="organic-brief" style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>
                  {activeTab === 'linkedin' && 'Topic or angle for the LinkedIn post'}
                  {activeTab === 'youtube' && 'Video topic and key points to cover'}
                  {activeTab === 'seo' && 'Target keyword or article topic'}
                </label>
                <textarea
                  id="organic-brief"
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
                  <a
                    href="/waitlist"
                    style={{ ...MONO, color: '#fbf7ee', background: '#a39c8e', border: 'none', padding: '8px 14px', textDecoration: 'none', cursor: 'pointer' }}
                  >
                    Schedule → (soon)
                  </a>
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
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)', margin: 0 }}>
                  {activeTab === 'linkedin' && '~400 words · hook + value + CTA · designed to stop the scroll'}
                  {activeTab === 'youtube' && 'Full script · intro → hook → value → CTA · 8–12 min format'}
                  {activeTab === 'seo' && '~800 words · keyword-optimized · H2 structure · meta description included'}
                </p>
              </div>
            )}
          </div>

          {/* Content calendar + stats */}
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
