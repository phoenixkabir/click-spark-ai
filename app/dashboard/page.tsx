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
            <span style={{ ...SERIF, fontSize: '16px', color: '#1a1814' }}>Click Spark<span style={{ color: '#8b2e2e' }}>.</span></span>
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
        <div style={{ marginBottom: '40px' }}>
          <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '8px' }}>Distribution OS</div>
          <h1 style={{ ...SERIF, fontSize: '52px', lineHeight: 1, color: '#1a1814', margin: 0 }}>
            {brief.brand || 'Your Brand'}
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--dim)', marginTop: '8px' }}>
            {brief.product} · {brief.audience}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '40px', alignItems: 'start' }}>

          {/* Brief form */}
          <div>
            <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '16px' }}>Company Brief</div>
            <form onSubmit={handleSave} style={{ border: '1px solid var(--rule)', borderTop: '2px solid #1a1814', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--paper)' }}>
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
                {saved ? '✓ Brief saved' : 'Save brief'}
              </button>
            </form>

            {/* Quick score */}
            <div style={{ marginTop: '20px', border: '1px solid var(--rule)', padding: '20px', background: 'var(--paper)' }}>
              <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '12px' }}>Quick actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/score" style={{ ...MONO, color: '#1a1814', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Score a creative</span><span>→</span>
                </a>
                <a href="/dashboard/paid" style={{ ...MONO, color: '#1a1814', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Launch Meta Ad</span><span>→</span>
                </a>
                <a href="/dashboard/ugc" style={{ ...MONO, color: '#1a1814', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Generate UGC scripts</span><span>→</span>
                </a>
                <a href="/dashboard/organic" style={{ ...MONO, color: '#1a1814', textDecoration: 'none', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Create content calendar</span><span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* 3 Engine tiles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Paid Engine */}
            <a href="/dashboard/paid" style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid var(--rule)', borderTop: '3px solid #8b2e2e', padding: '28px', background: 'var(--paper)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '6px' }}>01 · Meta Ads Engine</div>
                    <h2 style={{ ...SERIF, fontSize: '32px', color: '#1a1814', margin: 0 }}>Win Now</h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b2e2e', display: 'inline-block' }} />
                    <span style={{ ...MONO, color: '#8b2e2e', fontSize: '9px' }}>3 CAMPAIGNS RUNNING</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  {[['$4,200', 'total spend'], ['4.2×', 'avg ROAS'], ['3.1%', 'avg CTR'], ['84', 'avg brain score']].map(([v, l]) => (
                    <div key={l} style={{ borderTop: '1px solid var(--rule)', paddingTop: '10px' }}>
                      <div style={{ ...SERIF, fontSize: '28px', color: '#1a1814', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                      <div style={{ ...MONO, color: 'var(--faint)', marginTop: '2px' }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ ...MONO, color: '#8b2e2e' }}>Open Ads Engine →</div>
              </div>
            </a>

            {/* UGC Engine */}
            <a href="/dashboard/ugc" style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid var(--rule)', borderTop: '3px solid #6a6258', padding: '28px', background: 'var(--paper)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ ...MONO, color: '#6a6258', marginBottom: '6px' }}>02 · AI UGC Engine</div>
                    <h2 style={{ ...SERIF, fontSize: '32px', color: '#1a1814', margin: 0 }}>Subconscious Layer</h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6a6258', display: 'inline-block' }} />
                    <span style={{ ...MONO, color: '#6a6258', fontSize: '9px' }}>12 VIDEOS LIVE</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  {[['84K', 'total views'], ['3', 'creator accounts'], ['4.8%', 'engagement rate'], ['78', 'avg brain score']].map(([v, l]) => (
                    <div key={l} style={{ borderTop: '1px solid var(--rule)', paddingTop: '10px' }}>
                      <div style={{ ...SERIF, fontSize: '28px', color: '#1a1814', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                      <div style={{ ...MONO, color: 'var(--faint)', marginTop: '2px' }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ ...MONO, color: '#6a6258' }}>Open UGC Engine →</div>
              </div>
            </a>

            {/* Organic Engine */}
            <a href="/dashboard/organic" style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid var(--rule)', borderTop: '3px solid #a39c8e', padding: '28px', background: 'var(--paper)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ ...MONO, color: '#a39c8e', marginBottom: '6px' }}>03 · Content Engine</div>
                    <h2 style={{ ...SERIF, fontSize: '32px', color: '#1a1814', margin: 0 }}>Win Forever</h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a39c8e', display: 'inline-block' }} />
                    <span style={{ ...MONO, color: '#a39c8e', fontSize: '9px' }}>4 POSTS THIS WEEK</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  {[['28', 'pieces published'], ['12K', 'organic reach'], ['LinkedIn', 'YouTube · SEO'], ['82', 'avg brain score']].map(([v, l]) => (
                    <div key={l} style={{ borderTop: '1px solid var(--rule)', paddingTop: '10px' }}>
                      <div style={{ ...SERIF, fontSize: '24px', color: '#1a1814', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
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
