'use client'

import { useState } from 'react'

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }
const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }

const DEMO_BRIEF = {
  brand: 'Liquid Death',
  product: 'Canned mountain water',
  audience: 'Millennial & Gen Z anti-mainstream consumers',
  tone: 'Irreverent, punk, anti-corporate',
}

const HOW_IT_WORKS = [
  {
    step: '01',
    label: 'Brand Brief',
    desc: 'You fill in your brand once — name, product, audience, tone. This becomes the single source of truth for everything.',
    detail: 'Brand · Product · Audience · Tone',
    color: '#1a1814',
  },
  {
    step: '02',
    label: 'Intelligence Layer',
    desc: 'The brief is processed into a shared context — positioning, messaging pillars, audience psychology — that every engine reads from.',
    detail: 'Positioning · Messaging · Voice',
    color: '#6a6258',
  },
  {
    step: '03',
    label: 'Three Engines. One Voice.',
    desc: 'Paid ads, UGC scripts, and organic content all pull from the same data layer. Your brand sounds identical whether it\'s a Meta ad or a LinkedIn post.',
    detail: 'Paid · UGC · Organic',
    color: '#8b2e2e',
  },
]

const PRINCIPLES = [
  {
    label: 'No re-briefing',
    desc: 'Write your brand context once. Every engine — paid, UGC, organic — uses it automatically. Change the brief and all three update.',
  },
  {
    label: 'Consistent positioning',
    desc: 'The same audience psychology, the same tone, the same messaging hierarchy flows through every channel. No brand drift across formats.',
  },
  {
    label: 'Cross-channel learning',
    desc: 'What performs in paid informs UGC angles. What lands organically gets tested in ads. The data layer connects what most companies keep siloed.',
  },
]

export default function DashboardPage() {
  const [brief, setBrief] = useState(DEMO_BRIEF)
  const [saved, setSaved] = useState(true)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid #1a1814',
        padding: '16px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '6px', textDecoration: 'none' }}>
            <span style={{ color: '#8b2e2e', ...SERIF, fontSize: '16px' }}>◆</span>
            <span style={{ ...SERIF, fontSize: '16px', color: '#1a1814' }}>ClipSpark<span style={{ color: '#8b2e2e' }}>.</span></span>
          </a>
          <span style={{ ...MONO, color: '#a39c8e' }}>/ Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {([['Paid', '/dashboard/paid'], ['UGC', '/dashboard/ugc'], ['Organic', '/dashboard/organic'], ['Score', '/score']] as [string, string][]).map(([l, h]) => (
            <a key={l} href={h} style={{ ...MONO, color: '#6a6258', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b2e2e', display: 'inline-block' }} />
          <span style={{ ...MONO, color: '#8b2e2e', fontSize: '9px' }}>OS RUNNING</span>
        </div>
      </nav>

      <div style={{ padding: '48px 40px', flex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '8px' }}>Distribution OS</div>
          <h1 style={{ ...SERIF, fontSize: '52px', lineHeight: 1, color: '#1a1814', margin: '0 0 8px' }}>
            {brief.brand || 'Your Brand'}
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--dim)', margin: 0 }}>
            {brief.product} · {brief.audience}
          </p>
        </div>

        {/* How it works — architecture strip */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <div style={{ ...MONO, color: 'var(--faint)' }}>How self-distribution works</div>
            <div style={{ ...MONO, color: 'var(--faint)', fontSize: '9px' }}>Single data layer · three engines · one voice</div>
          </div>

          {/* 3-step flow */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr 40px 1fr', gap: '0', alignItems: 'stretch', marginBottom: '32px' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <>
                <div
                  key={step.step}
                  style={{
                    border: '1px solid var(--rule)',
                    borderTop: `3px solid ${step.color}`,
                    padding: '24px',
                    background: 'var(--paper)',
                  }}
                >
                  <div style={{ ...MONO, color: step.color, marginBottom: '10px' }}>{step.step} · {step.label}</div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)', lineHeight: 1.6, margin: '0 0 16px' }}>
                    {step.desc}
                  </p>
                  <div style={{ ...MONO, color: 'var(--faint)', fontSize: '9px', borderTop: '1px solid var(--rule)', paddingTop: '10px' }}>
                    {step.detail}
                  </div>
                </div>
                {i < 2 && (
                  <div key={`arrow-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ ...MONO, color: 'var(--faint)', fontSize: '16px' }}>→</span>
                  </div>
                )}
              </>
            ))}
          </div>

          {/* Engine output illustration */}
          <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)', padding: '0' }}>
            <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', background: '#8b2e2e' }} />
              <div style={{ ...MONO, color: '#1a1814' }}>Intelligence layer → engine outputs</div>
              <div style={{ ...MONO, color: 'var(--faint)', marginLeft: 'auto' }}>same brief · different formats</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0' }}>
              {[
                {
                  engine: '01 · Paid',
                  color: '#8b2e2e',
                  items: [
                    { label: 'Hook', value: `"${brief.tone?.split(',')[0]?.trim() || 'Irreverent'} — [product benefit]"` },
                    { label: 'Audience target', value: brief.audience?.split(' ')[0] + ' · interest-based' },
                    { label: 'Creative angle', value: 'Anti-mainstream identity play' },
                    { label: 'CTA type', value: 'Brand-first, soft conversion' },
                  ],
                },
                {
                  engine: '02 · UGC',
                  color: '#6a6258',
                  items: [
                    { label: 'Creator persona', value: `${brief.audience?.split(' ')[0] || 'Gen Z'} lifestyle · authentic` },
                    { label: 'Script angle', value: 'Social proof + identity signal' },
                    { label: 'Platform', value: 'TikTok · Instagram Reels' },
                    { label: 'Tone', value: brief.tone?.split(',')[0]?.trim() || 'Irreverent' },
                  ],
                },
                {
                  engine: '03 · Organic',
                  color: '#a39c8e',
                  items: [
                    { label: 'LinkedIn angle', value: 'Founder POV · brand story' },
                    { label: 'YouTube hook', value: 'Why [product] exists — long-form' },
                    { label: 'SEO cluster', value: `${brief.product?.split(' ')[0] || 'Brand'} · lifestyle keywords` },
                    { label: 'Voice', value: brief.tone?.split(',').slice(0, 2).join(' · ') },
                  ],
                },
              ].map((eng, i) => (
                <div
                  key={eng.engine}
                  style={{
                    padding: '20px 24px',
                    borderRight: i < 2 ? '1px solid var(--rule)' : 'none',
                  }}
                >
                  <div style={{ ...MONO, color: eng.color, marginBottom: '14px' }}>{eng.engine}</div>
                  {eng.items.map(item => (
                    <div key={item.label} style={{ marginBottom: '10px' }}>
                      <div style={{ ...MONO, color: 'var(--faint)', fontSize: '9px', marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--dim)', fontStyle: 'italic' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 3 principles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', marginTop: '16px', border: '1px solid var(--rule)' }}>
            {PRINCIPLES.map((p, i) => (
              <div
                key={p.label}
                style={{
                  padding: '20px 24px',
                  borderRight: i < 2 ? '1px solid var(--rule)' : 'none',
                  background: '#fbf7ee',
                }}
              >
                <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '8px' }}>◆ {p.label}</div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '40px', alignItems: 'start' }}>

          {/* Brief form */}
          <div>
            <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '16px' }}>Brand Brief · Data Layer</div>
            <form onSubmit={handleSave} style={{ border: '1px solid var(--rule)', borderTop: '2px solid #1a1814', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--paper)' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--faint)', margin: '0', lineHeight: 1.5 }}>
                Fill this in once. All three engines — paid, UGC, organic — read from it automatically.
              </p>
              {([
                ['Brand name', 'brand', 'e.g. Liquid Death'],
                ['Product / service', 'product', 'e.g. Canned mountain water'],
                ['Target audience', 'audience', 'e.g. Gen Z, health-conscious...'],
                ['Brand tone', 'tone', 'e.g. Irreverent, bold, minimal...'],
              ] as [string, keyof typeof DEMO_BRIEF, string][]).map(([label, key, placeholder]) => (
                <div key={key}>
                  <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '6px' }}>{label}</label>
                  <input
                    type="text"
                    value={brief[key]}
                    onChange={e => { setBrief(b => ({ ...b, [key]: e.target.value })); setSaved(false) }}
                    placeholder={placeholder}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: 'transparent', border: 'none',
                      borderBottom: '1px solid var(--rule)',
                      padding: '8px 0', fontFamily: 'var(--font-sans)',
                      fontSize: '14px', color: 'var(--ink)', outline: 'none',
                    }}
                  />
                </div>
              ))}
              <button type="submit" style={{
                background: saved ? 'var(--faint)' : '#1a1814',
                color: '#fbf7ee', border: 'none', padding: '12px',
                fontFamily: 'var(--font-sans)', fontSize: '13px',
                cursor: saved ? 'default' : 'pointer',
              }}>
                {saved ? '✓ Brief saved · engines synced' : 'Save brief → sync all engines'}
              </button>
            </form>

            {/* Quick actions */}
            <div style={{ marginTop: '20px', border: '1px solid var(--rule)', padding: '20px', background: 'var(--paper)' }}>
              <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '12px' }}>Quick actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {([
                  ['Score a creative', '/score'],
                  ['Launch Meta Ad', '/dashboard/paid'],
                  ['Generate UGC scripts', '/dashboard/ugc'],
                  ['Create content calendar', '/dashboard/organic'],
                ] as [string, string][]).map(([label, href]) => (
                  <a key={label} href={href} style={{ ...MONO, color: '#1a1814', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{label}</span><span>→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Engine tiles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <a href="/dashboard/paid" style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid var(--rule)', borderTop: '3px solid #8b2e2e', padding: '28px', background: 'var(--paper)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '6px' }}>01 · Paid Ads Engine</div>
                    <h2 style={{ ...SERIF, fontSize: '32px', color: '#1a1814', margin: 0 }}>Win Now</h2>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--dim)', margin: '6px 0 0', lineHeight: 1.4 }}>
                      Score creatives before spending. Meta + Taboola campaigns, AI analysis, pause/resume from here.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b2e2e', display: 'inline-block' }} />
                    <span style={{ ...MONO, color: '#8b2e2e', fontSize: '9px' }}>8 active</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  {[['₹3.4L', 'spend · 30d'], ['4.8×', 'best ROAS'], ['1.5%', 'avg CTR'], ['11', 'campaigns']].map(([v, l]) => (
                    <div key={l} style={{ borderTop: '1px solid var(--rule)', paddingTop: '10px' }}>
                      <div style={{ ...SERIF, fontSize: '28px', color: '#1a1814', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                      <div style={{ ...MONO, color: 'var(--faint)', marginTop: '2px' }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ ...MONO, color: '#8b2e2e' }}>Open Ads Engine →</div>
              </div>
            </a>

            <a href="/dashboard/ugc" style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid var(--rule)', borderTop: '3px solid #6a6258', padding: '28px', background: 'var(--paper)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ ...MONO, color: '#6a6258', marginBottom: '6px' }}>02 · AI UGC Engine</div>
                    <h2 style={{ ...SERIF, fontSize: '32px', color: '#1a1814', margin: 0 }}>Subconscious Layer</h2>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--dim)', margin: '6px 0 0', lineHeight: 1.4 }}>
                      Full pipeline from ideation to scripting to video generation to publish — SOTA models at every stage.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6a6258', display: 'inline-block' }} />
                    <span style={{ ...MONO, color: '#6a6258', fontSize: '9px' }}>stages 01–02 live</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  {[['5', 'pipeline stages'], ['GPT-4o', 'ideation + script'], ['HeyGen', 'video gen · soon'], ['fMRI', 'brain-scored output']].map(([v, l]) => (
                    <div key={l} style={{ borderTop: '1px solid var(--rule)', paddingTop: '10px' }}>
                      <div style={{ ...SERIF, fontSize: '22px', color: '#1a1814', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                      <div style={{ ...MONO, color: 'var(--faint)', marginTop: '2px' }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ ...MONO, color: '#6a6258' }}>Open UGC Engine →</div>
              </div>
            </a>

            <a href="/dashboard/organic" style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid var(--rule)', borderTop: '3px solid #a39c8e', padding: '28px', background: 'var(--paper)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ ...MONO, color: '#a39c8e', marginBottom: '6px' }}>03 · Content Engine</div>
                    <h2 style={{ ...SERIF, fontSize: '32px', color: '#1a1814', margin: 0 }}>Win Forever</h2>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--dim)', margin: '6px 0 0', lineHeight: 1.4 }}>
                      LinkedIn, YouTube, and SEO content — all generated from the same brand brief, in the same voice.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a39c8e', display: 'inline-block' }} />
                    <span style={{ ...MONO, color: '#a39c8e', fontSize: '9px' }}>3 formats live</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  {[['LinkedIn', 'founder posts'], ['YouTube', 'long-form scripts'], ['SEO', 'keyword clusters'], ['1 brief', 'all three channels']].map(([v, l]) => (
                    <div key={l} style={{ borderTop: '1px solid var(--rule)', paddingTop: '10px' }}>
                      <div style={{ ...SERIF, fontSize: '22px', color: '#1a1814', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                      <div style={{ ...MONO, color: 'var(--faint)', marginTop: '2px' }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ ...MONO, color: '#a39c8e' }}>Open Content Engine →</div>
              </div>
            </a>

          </div>
        </div>
      </div>
    </main>
  )
}
