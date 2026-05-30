'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TaboolaCampaign {
  id: string
  name: string
  status: string
  spent: number
  impressions: number
  clicks: number
  ctr: number
  roas: number | null
}

interface AdsData {
  source: string
  campaigns: TaboolaCampaign[]
  summary: {
    totalSpend: number
    totalImpressions: number
    totalClicks: number
    avgCtr: number
    activeCampaigns: number
  }
}

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }
const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }

const DEMO_CAMPAIGNS = [
  {
    id: '1',
    name: 'Mountain Water · Anti-boring',
    hook: '"You\'re not drinking water. You\'re refusing to be boring."',
    status: 'ACTIVE',
    brainScore: 88,
    spend: '$1,840',
    roas: '5.1×',
    ctr: '4.2%',
    impressions: '284K',
    started: 'May 22',
  },
  {
    id: '2',
    name: 'Summer Reels · Punk Water',
    hook: '"Drink water like you mean it."',
    status: 'ACTIVE',
    brainScore: 76,
    spend: '$1,100',
    roas: '3.8×',
    ctr: '2.9%',
    impressions: '196K',
    started: 'May 25',
  },
  {
    id: '3',
    name: 'UGC-style · Party Scene',
    hook: '"The only water that gets carded."',
    status: 'PAUSED',
    brainScore: 71,
    spend: '$560',
    roas: '2.4×',
    ctr: '1.8%',
    impressions: '88K',
    started: 'May 18',
  },
]

export default function PaidEnginePage() {
  const router = useRouter()
  const [connected, setConnected] = useState(false)
  const [creating, setCreating] = useState(false)
  const [creative, setCreative] = useState('')
  const [budget, setBudget] = useState('50')
  const [launching, setLaunching] = useState(false)
  const [launched, setLaunched] = useState(false)
  const [adsData, setAdsData] = useState<AdsData | null>(null)
  const [adsLoading, setAdsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ads-data')
      .then(r => r.json())
      .then(d => { if (!d.error) setAdsData(d) })
      .catch(() => {})
      .finally(() => setAdsLoading(false))
  }, [])

  async function handleLaunch(e: React.FormEvent) {
    e.preventDefault()
    if (!creative.trim()) return
    setLaunching(true)
    // score first then redirect to results with launch CTA
    try {
      const res = await fetch('/api/score-concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creative: creative.trim() }),
      })
      if (!res.ok) throw new Error()
      const { shareId } = await res.json()
      router.push(`/results/${shareId}?from=paid&budget=${budget}`)
    } catch {
      setLaunching(false)
    }
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
          <span style={{ ...MONO, color: '#8b2e2e' }}>Meta Ads Engine</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/dashboard/ugc" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none' }}>UGC →</a>
          <a href="/dashboard/organic" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none' }}>Organic →</a>
        </div>
      </nav>

      <div style={{ padding: '48px 40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '8px' }}>01 · Meta Ads Engine</div>
            <h1 style={{ ...SERIF, fontSize: '52px', lineHeight: 1, color: '#1a1814', margin: '0 0 8px' }}>Win Now.</h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--dim)', margin: 0 }}>
              Score before you spend. Launch from here. Track what actually worked.
            </p>
          </div>

          {/* Meta Ads connect */}
          <div style={{ border: '1px solid var(--rule)', padding: '20px 24px', background: 'var(--paper)', minWidth: '280px' }}>
            <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '12px' }}>Meta Ads Manager</div>
            {connected ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b2e2e', display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#1a1814' }}>Connected · Liquid Death Ads</span>
                </div>
                <div style={{ ...MONO, color: 'var(--faint)' }}>Ad account · #act_2847364</div>
              </div>
            ) : (
              <button
                onClick={() => setConnected(true)}
                style={{
                  width: '100%', background: '#1877F2', color: 'white',
                  border: 'none', padding: '10px', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
                }}
              >
                Connect Meta Ads →
              </button>
            )}
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0', marginBottom: '40px', border: '1px solid var(--rule)', borderTop: '2px solid #8b2e2e', background: 'var(--paper)' }}>
          {(() => {
            const s = adsData?.summary
            const fmt = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n)
            const stats = s
              ? [
                  [`₹${fmt(s.totalSpend)}`, 'Total spend (30d)'],
                  [s.avgCtr ? `${s.avgCtr}%` : '—', 'Avg CTR'],
                  [fmt(s.totalImpressions), 'Impressions'],
                  [fmt(s.totalClicks), 'Clicks'],
                  [String(s.activeCampaigns), 'Active campaigns'],
                ]
              : [['$3,500', 'Total spend'], ['4.2×', 'Avg ROAS'], ['3.1%', 'Avg CTR'], ['568K', 'Impressions'], ['81', 'Avg brain score']]
            return stats.map(([v, l], i) => (
              <div key={l} style={{ padding: '20px 24px', borderRight: i < 4 ? '1px solid var(--rule)' : 'none' }}>
                <div style={{ ...SERIF, fontSize: '36px', color: '#1a1814', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                <div style={{ ...MONO, color: 'var(--faint)', marginTop: '4px' }}>{l}</div>
              </div>
            ))
          })()}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '40px', alignItems: 'start' }}>

          {/* Campaign list */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ ...MONO, color: 'var(--faint)' }}>Active campaigns</div>
              <button
                onClick={() => setCreating(true)}
                style={{ ...MONO, color: '#fbf7ee', background: '#8b2e2e', border: 'none', padding: '8px 14px', cursor: 'pointer' }}
              >
                + New campaign
              </button>
            </div>

            {/* Source badge */}
            {adsData && (
              <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b2e2e', display: 'inline-block' }} />
                Live · Taboola · {adsData.summary.activeCampaigns} running · last 30 days
              </div>
            )}

            <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
              {/* Table header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '2fr 80px 80px 80px 80px 100px',
                gap: '12px', padding: '12px 20px',
                borderBottom: '2px solid #1a1814',
              }}>
                {['Campaign', 'CTR', 'Spend', 'Impressions', 'Clicks', 'Status'].map(h => (
                  <span key={h} style={{ ...MONO, color: 'var(--faint)' }}>{h}</span>
                ))}
              </div>

              {adsLoading ? (
                <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                  <span style={{ ...MONO, color: 'var(--faint)' }}>Loading live campaign data…</span>
                </div>
              ) : (adsData?.campaigns || DEMO_CAMPAIGNS).map((c: any, i: number, arr: any[]) => {
                const isReal = !!adsData
                const fmtNum = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n)
                return (
                  <div key={c.id} style={{
                    display: 'grid', gridTemplateColumns: '2fr 80px 80px 80px 80px 100px',
                    gap: '12px', padding: '16px 20px',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--rule)' : 'none',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#1a1814', fontWeight: 500, marginBottom: '2px' }}>
                        {isReal ? c.name : c.name}
                      </div>
                      {!isReal && <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--dim)', fontStyle: 'italic' }}>{c.hook}</div>}
                    </div>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#1a1814' }}>
                      {isReal ? `${c.ctr}%` : c.ctr}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#1a1814' }}>
                      {isReal ? `₹${fmtNum(c.spent)}` : c.spend}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)' }}>
                      {isReal ? fmtNum(c.impressions) : c.impressions}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)' }}>
                      {isReal ? fmtNum(c.clicks) : '—'}
                    </span>
                    <span style={{
                      ...MONO, fontSize: '9px',
                      color: (isReal ? c.status === 'RUNNING' : c.status === 'ACTIVE') ? '#8b2e2e' : 'var(--faint)',
                    }}>{c.status}</span>
                  </div>
                )
              })}
            </div>

            {/* ROAS vs Brain Score correlation note */}
            <div style={{ marginTop: '20px', border: '1px solid var(--rule)', padding: '16px 20px', background: 'var(--paper)', borderLeft: '3px solid #8b2e2e' }}>
              <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '6px' }}>Data flywheel insight</div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)', lineHeight: 1.55, margin: 0 }}>
                Campaign with brain score 88 is delivering 5.1× ROAS vs 2.4× for score 71.
                Every campaign you run trains the prediction model. After 1,000 campaigns, the model knows what your specific audience's brain responds to — no competitor can buy that dataset.
              </p>
            </div>
          </div>

          {/* Launch new campaign */}
          <div>
            <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '16px' }}>Score + launch new ad</div>
            <form onSubmit={handleLaunch} style={{ border: '1px solid var(--rule)', borderTop: '2px solid #8b2e2e', padding: '24px', background: 'var(--paper)', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div>
                <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>
                  Your creative — hook, visual, script
                </label>
                <textarea
                  value={creative}
                  onChange={e => setCreative(e.target.value)}
                  placeholder={`Hook: "You're not drinking water. You're refusing to be boring."

Visual: Person at a party, Liquid Death in hand, totally unbothered.

Script: Open on a crowded house party. One person stands out. They're holding a black can. Everyone notices. Text: Refuse to be boring.`}
                  rows={8}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>Daily budget (USD)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    min="5"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: 'transparent', border: 'none',
                      borderBottom: '1px solid var(--rule)',
                      padding: '8px 0', fontFamily: 'var(--font-sans)',
                      fontSize: '14px', color: 'var(--ink)', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>Objective</label>
                  <select style={{
                    width: '100%', background: 'transparent', border: 'none',
                    borderBottom: '1px solid var(--rule)',
                    padding: '8px 0', fontFamily: 'var(--font-sans)',
                    fontSize: '14px', color: 'var(--ink)', outline: 'none',
                  }}>
                    <option>Conversions</option>
                    <option>Traffic</option>
                    <option>Awareness</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={launching || !creative.trim()}
                style={{
                  background: launching || !creative.trim() ? 'var(--faint)' : '#8b2e2e',
                  color: '#fbf7ee', border: 'none', padding: '14px',
                  fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
                  cursor: launching || !creative.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {launching ? 'Scoring with TRIBE v2…' : 'Score + launch →'}
              </button>

              <p style={{ ...MONO, color: 'var(--faint)', margin: 0, textAlign: 'center' }}>
                Scores first · shows brain report · then launches
              </p>
            </form>
          </div>

        </div>
      </div>
    </main>
  )
}
