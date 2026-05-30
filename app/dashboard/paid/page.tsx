'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { AnalysisResult } from '@/lib/campaign-analyzer'

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

interface MetaCampaign {
  id: string
  name: string
  brand: string
  status: string
  objective: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  roas: number | null
}

interface MetaData {
  campaigns: MetaCampaign[]
  summary: {
    totalSpend: number
    totalImpressions: number
    totalClicks: number
    avgCtr: number
    activeCampaigns: number
  }
  _demo?: boolean
}

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }
const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }

const GRADE_COLORS: Record<string, string> = {
  A: '#2d6a4f', B: '#40916c', C: '#d4a017', D: '#9d4b00', F: '#8b2e2e',
}

const DEMO_CAMPAIGNS = [
  { id: '1', name: 'Mountain Water · Anti-boring', hook: '"You\'re not drinking water. You\'re refusing to be boring."', status: 'ACTIVE', brainScore: 88, spend: '$1,840', roas: '5.1×', ctr: '4.2%', impressions: '284K', started: 'May 22' },
  { id: '2', name: 'Summer Reels · Punk Water', hook: '"Drink water like you mean it."', status: 'ACTIVE', brainScore: 76, spend: '$1,100', roas: '3.8×', ctr: '2.9%', impressions: '196K', started: 'May 25' },
  { id: '3', name: 'UGC-style · Party Scene', hook: '"The only water that gets carded."', status: 'PAUSED', brainScore: 71, spend: '$560', roas: '2.4×', ctr: '1.8%', impressions: '88K', started: 'May 18' },
]

function GradeBadge({ grade }: { grade: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '24px', height: '24px',
      background: GRADE_COLORS[grade] || '#a39c8e',
      color: '#fbf7ee',
      fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
      letterSpacing: 0,
    }}>
      {grade}
    </span>
  )
}

export default function PaidEnginePage() {
  const router = useRouter()
  const [connected, setConnected] = useState(false)
  const [creative, setCreative] = useState('')
  const [budget, setBudget] = useState('50')
  const [launching, setLaunching] = useState(false)
  const [adsData, setAdsData] = useState<AdsData | null>(null)
  const [adsLoading, setAdsLoading] = useState(true)

  // Meta Ads
  const [metaData, setMetaData] = useState<MetaData | null>(null)
  const [metaLoading, setMetaLoading] = useState(true)
  const [metaError, setMetaError] = useState('')
  const [activeSource, setActiveSource] = useState<'taboola' | 'meta'>('meta')

  // AI analysis
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')

  // Campaign status control
  const [statusUpdating, setStatusUpdating] = useState<Record<string, boolean>>({})
  const [statusError, setStatusError] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/ads-data')
      .then(r => r.json())
      .then(d => { if (!d.error) setAdsData(d) })
      .catch(() => {})
      .finally(() => setAdsLoading(false))

    fetch('/api/meta-ads')
      .then(r => r.json())
      .then(d => {
        if (d.error) setMetaError(d.error)
        else setMetaData(d)
      })
      .catch(() => setMetaError('Failed to load Meta data'))
      .finally(() => setMetaLoading(false))
  }, [])

  async function handleAnalyze() {
    const isMetaActive = activeSource === 'meta' && metaData
    const rawCampaigns = isMetaActive ? metaData!.campaigns : adsData?.campaigns
    if (!rawCampaigns?.length) return
    setAnalyzing(true)
    setAnalyzeError('')
    setAnalysis(null)
    try {
      const payload = isMetaActive
        ? (rawCampaigns as MetaCampaign[]).map(c => ({
            id: c.id, name: c.name, platform: 'Meta',
            status: c.status, spend: c.spend,
            impressions: c.impressions, clicks: c.clicks, ctr: c.ctr, roas: c.roas,
          }))
        : (rawCampaigns as TaboolaCampaign[]).map(c => ({
            id: c.id, name: c.name, platform: 'Taboola',
            status: c.status, spend: c.spent,
            impressions: c.impressions, clicks: c.clicks, ctr: c.ctr, roas: c.roas,
          }))
      const res = await fetch('/api/campaigns/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaigns: payload, currency: '₹' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAnalysis(data.analysis)
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  async function handleStatusToggle(campaign: TaboolaCampaign) {
    const newStatus = campaign.status === 'RUNNING' ? 'PAUSED' : 'RUNNING'
    setStatusUpdating(p => ({ ...p, [campaign.id]: true }))
    setStatusError(p => ({ ...p, [campaign.id]: '' }))
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      // Optimistically update local state
      setAdsData(prev => prev ? {
        ...prev,
        campaigns: prev.campaigns.map(c =>
          c.id === campaign.id ? { ...c, status: newStatus } : c
        ),
      } : prev)
    } catch (err) {
      setStatusError(p => ({ ...p, [campaign.id]: err instanceof Error ? err.message : 'Update failed' }))
    } finally {
      setStatusUpdating(p => ({ ...p, [campaign.id]: false }))
    }
  }

  async function handleLaunch(e: React.FormEvent) {
    e.preventDefault()
    if (!creative.trim()) return
    setLaunching(true)
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

  const activeSummary = activeSource === 'meta' && metaData ? metaData.summary : adsData?.summary
  const metaCampaigns = metaData?.campaigns || []
  const taboolaCampaigns = adsData?.campaigns || []
  const isDormant = activeSource === 'taboola' && adsData && taboolaCampaigns.every(c => c.spent === 0)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid #1a1814', padding: '16px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/dashboard" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none' }}>← Dashboard</a>
          <span style={{ ...MONO, color: 'var(--faint)' }}>/</span>
          <span style={{ ...MONO, color: '#8b2e2e' }}>Ads Engine</span>
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
            <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '8px' }}>01 · Ads Engine</div>
            <h1 style={{ ...SERIF, fontSize: '52px', lineHeight: 1, color: '#1a1814', margin: '0 0 8px' }}>Win Now.</h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--dim)', margin: 0 }}>
              Score before you spend. Analyze what worked. Control campaigns from here.
            </p>
          </div>

          {/* Meta Ads connect widget */}
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
                  width: '100%', background: '#8b2e2e', color: '#f5f2ec',
                  border: 'none', padding: '10px', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                Connect Meta Ads →
              </button>
            )}
          </div>
        </div>

        {/* Source switcher */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '24px', border: '1px solid var(--rule)', width: 'fit-content' }}>
          {(['meta', 'taboola'] as const).map(src => (
            <button
              key={src}
              onClick={() => { setActiveSource(src); setAnalysis(null) }}
              style={{
                ...MONO, padding: '10px 20px', cursor: 'pointer', border: 'none',
                background: activeSource === src ? '#1a1814' : 'var(--paper)',
                color: activeSource === src ? '#fbf7ee' : 'var(--dim)',
                borderRight: src === 'meta' ? '1px solid var(--rule)' : 'none',
              }}
            >
              {src === 'meta' ? '◈ Meta · Facebook' : '◈ Taboola · Native'}
            </button>
          ))}
        </div>

        {/* Meta token missing notice */}
        {activeSource === 'meta' && metaError.includes('not configured') && (
          <div style={{
            marginBottom: '24px', padding: '16px 20px',
            background: '#fbf7ee', border: '1px solid var(--rule)',
            borderLeft: '3px solid #1877F2',
          }}>
            <div style={{ ...MONO, color: '#1877F2', marginBottom: '6px' }}>Meta access token needed</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)', margin: '0 0 8px', lineHeight: 1.5 }}>
              Add <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 5px' }}>FACEBOOK_ACCESS_TOKEN</code> to your <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 5px' }}>.env.local</code> to pull live campaign data from all three accounts (Tradewise, Astrolearn, Healoved).
            </p>
            <div style={{ ...MONO, color: 'var(--faint)', fontSize: '9px' }}>
              Get it: Meta Business Suite → Settings → System Users → Generate token → ad_read permission
            </div>
          </div>
        )}

        {activeSource === 'meta' && metaError && !metaError.includes('not configured') && (
          <div style={{
            marginBottom: '24px', padding: '14px 20px',
            background: '#fff0f0', border: '1px solid #f5c6cb',
            borderLeft: '3px solid #c0392b',
          }}>
            <div style={{ ...MONO, color: '#c0392b', marginBottom: '4px' }}>Meta API error</div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#c0392b' }}>{metaError}</span>
          </div>
        )}

        {/* Summary stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
          marginBottom: '24px', border: '1px solid var(--rule)',
          borderTop: `2px solid ${activeSource === 'meta' ? '#1877F2' : '#8b2e2e'}`,
          background: 'var(--paper)',
        }}>
          {(() => {
            const s = activeSummary
            const fmt = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n)
            const isLoading = activeSource === 'meta' ? metaLoading : adsLoading
            const stats = s && !isLoading
              ? [
                  [`₹${fmt(s.totalSpend)}`, 'Total spend · 30d'],
                  [s.avgCtr ? `${s.avgCtr}%` : '—', 'Avg CTR'],
                  [fmt(s.totalImpressions), 'Impressions'],
                  [fmt(s.totalClicks), 'Clicks'],
                  [String(s.activeCampaigns), 'Active now'],
                ]
              : [['—', 'Total spend · 30d'], ['—', 'Avg CTR'], ['—', 'Impressions'], ['—', 'Clicks'], ['—', 'Active now']]
            return stats.map(([v, l], i) => (
              <div key={l} style={{ padding: '20px 24px', borderRight: i < 4 ? '1px solid var(--rule)' : 'none' }}>
                <div style={{ ...SERIF, fontSize: '36px', color: '#1a1814', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                <div style={{ ...MONO, color: 'var(--faint)', marginTop: '4px' }}>{l}</div>
              </div>
            ))
          })()}
        </div>

        {/* Dormant account notice */}
        {isDormant && (
          <div style={{
            marginBottom: '24px', padding: '14px 20px',
            background: '#fbf7ee', border: '1px solid var(--rule)',
            borderLeft: '3px solid #d4a017',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <span style={{ ...MONO, color: '#d4a017' }}>Dormant account</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)' }}>
              All campaigns have zero spend in the last 30 days. Campaigns are imported from Taboola — reactivate or create new campaigns to start collecting performance data.
            </span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '40px', alignItems: 'start' }}>

          {/* Campaign list + Analysis */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '4px' }}>Campaigns · {activeSource === 'meta' ? 'Meta' : 'Taboola'}</div>
                {activeSource === 'meta' && metaData && (
                  <div style={{ ...MONO, color: 'var(--faint)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1877F2', display: 'inline-block' }} />
                    {metaData._demo ? 'Demo · Meta · ' : 'Live · Meta · '}{metaData.summary.activeCampaigns} active · last 30 days · 3 accounts
                    {metaData._demo && <span style={{ background: '#d4a017', color: '#fbf7ee', padding: '1px 6px' }}>demo</span>}
                  </div>
                )}
                {activeSource === 'taboola' && adsData && (
                  <div style={{ ...MONO, color: 'var(--faint)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b2e2e', display: 'inline-block' }} />
                    Live · Taboola · {adsData.summary.activeCampaigns} running · last 30 days
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {((activeSource === 'meta' && metaCampaigns.length > 0) || (activeSource === 'taboola' && taboolaCampaigns.length > 0)) && (
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    style={{
                      ...MONO, cursor: analyzing ? 'wait' : 'pointer',
                      background: analyzing ? 'var(--faint)' : 'var(--paper)',
                      color: analyzing ? '#fbf7ee' : '#8b2e2e',
                      border: '1px solid #8b2e2e',
                      padding: '8px 14px',
                    }}
                  >
                    {analyzing ? 'Analyzing…' : '★ AI Analyze'}
                  </button>
                )}
                <button
                  style={{ ...MONO, color: '#fbf7ee', background: '#8b2e2e', border: 'none', padding: '8px 14px', cursor: 'pointer' }}
                >
                  + New campaign
                </button>
              </div>
            </div>

            {/* Campaign table */}
            <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)', marginBottom: '16px' }}>
              {activeSource === 'meta' ? (
                // Meta columns (include ROAS + conversions)
                <>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '2fr 70px 70px 80px 80px 80px 90px',
                    gap: '8px', padding: '12px 20px', borderBottom: '2px solid #1a1814',
                  }}>
                    {['Campaign', 'Grade', 'CTR', 'Spend ₹', 'ROAS', 'Impr.', 'Status'].map(h => (
                      <span key={h} style={{ ...MONO, color: 'var(--faint)' }}>{h}</span>
                    ))}
                  </div>
                  {metaLoading ? (
                    <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                      <span style={{ ...MONO, color: 'var(--faint)' }}>Loading Meta campaign data…</span>
                    </div>
                  ) : metaError && !metaError.includes('not configured') ? null : metaCampaigns.length === 0 ? (
                    <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                      <span style={{ ...MONO, color: 'var(--faint)' }}>
                        {metaError.includes('not configured') ? 'Add FACEBOOK_ACCESS_TOKEN to see campaigns' : 'No campaigns found'}
                      </span>
                    </div>
                  ) : metaCampaigns.map((c, i) => {
                    const fmtNum = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n)
                    const campaignGrade = analysis?.campaigns.find(a => a.id === c.id)
                    return (
                      <div key={c.id} style={{
                        display: 'grid', gridTemplateColumns: '2fr 70px 70px 80px 80px 80px 90px',
                        gap: '8px', padding: '14px 20px',
                        borderBottom: i < metaCampaigns.length - 1 ? '1px solid var(--rule)' : 'none',
                        alignItems: 'center',
                      }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#1a1814', fontWeight: 500, marginBottom: '2px' }}>{c.name}</div>
                          <div style={{ ...MONO, fontSize: '9px', color: 'var(--faint)' }}>{c.brand} · {c.objective?.replace(/_/g, ' ').toLowerCase()}</div>
                          {campaignGrade && (
                            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--dim)', fontStyle: 'italic', marginTop: '2px' }}>
                              {campaignGrade.verdict}
                            </div>
                          )}
                        </div>
                        <div>{campaignGrade ? <GradeBadge grade={campaignGrade.grade} /> : <span style={{ ...MONO, color: 'var(--faint)' }}>—</span>}</div>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#1a1814' }}>{c.ctr ? `${c.ctr}%` : '—'}</span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#1a1814' }}>₹{fmtNum(c.spend)}</span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: c.roas && c.roas >= 3 ? '#2d6a4f' : '#1a1814' }}>
                          {c.roas ? `${c.roas}×` : '—'}
                        </span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)' }}>{fmtNum(c.impressions)}</span>
                        <span style={{ ...MONO, fontSize: '9px', color: c.status === 'ACTIVE' ? '#1877F2' : 'var(--faint)' }}>{c.status}</span>
                      </div>
                    )
                  })}
                </>
              ) : (
                // Taboola columns
                <>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '2fr 70px 80px 80px 70px 90px 80px',
                    gap: '8px', padding: '12px 20px', borderBottom: '2px solid #1a1814',
                  }}>
                    {['Campaign', 'Grade', 'CTR', 'Spend', 'Impressions', 'Status', 'Control'].map(h => (
                      <span key={h} style={{ ...MONO, color: 'var(--faint)' }}>{h}</span>
                    ))}
                  </div>
                  {adsLoading ? (
                    <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                      <span style={{ ...MONO, color: 'var(--faint)' }}>Loading Taboola data…</span>
                    </div>
                  ) : (adsData ? taboolaCampaigns : DEMO_CAMPAIGNS).map((c: any, i: number, arr: any[]) => {
                const isReal = !!adsData
                const fmtNum = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n)
                const campaignGrade = analysis?.campaigns.find(a => a.id === c.id)
                const isRunning = c.status === 'RUNNING' || c.status === 'ACTIVE'
                return (
                  <div key={c.id} style={{
                    display: 'grid', gridTemplateColumns: '2fr 70px 80px 80px 80px 90px 80px',
                    gap: '8px', padding: '14px 20px',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--rule)' : 'none',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#1a1814', fontWeight: 500, marginBottom: '2px' }}>
                        {c.name}
                      </div>
                      {campaignGrade && (
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--dim)', fontStyle: 'italic', lineHeight: 1.3 }}>
                          {campaignGrade.verdict}
                        </div>
                      )}
                      {!isReal && c.hook && (
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--dim)', fontStyle: 'italic' }}>{c.hook}</div>
                      )}
                    </div>
                    <div>
                      {campaignGrade
                        ? <GradeBadge grade={campaignGrade.grade} />
                        : <span style={{ ...MONO, color: 'var(--faint)' }}>—</span>
                      }
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
                    <span style={{
                      ...MONO, fontSize: '9px',
                      color: isRunning ? '#8b2e2e' : 'var(--faint)',
                    }}>{c.status}</span>
                    {isReal ? (
                      <div>
                        <button
                          onClick={() => handleStatusToggle(c)}
                          disabled={statusUpdating[c.id]}
                          style={{
                            ...MONO, fontSize: '9px', cursor: statusUpdating[c.id] ? 'wait' : 'pointer',
                            padding: '4px 8px', border: '1px solid var(--rule)',
                            background: isRunning ? '#fbf7ee' : '#8b2e2e',
                            color: isRunning ? '#8b2e2e' : '#fbf7ee',
                          }}
                        >
                          {statusUpdating[c.id] ? '…' : isRunning ? 'Pause' : 'Resume'}
                        </button>
                        {statusError[c.id] && (
                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: '#c0392b', marginTop: '2px' }}>
                            {statusError[c.id]}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ ...MONO, color: 'var(--faint)' }}>—</span>
                    )}
                  </div>
                )
              })}
                </>
              )}
            </div>

            {/* AI Analysis results */}
            {analyzeError && (
              <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #f5c6cb', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#c0392b' }}>{analyzeError}</span>
              </div>
            )}

            {analysis && (
              <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)', marginBottom: '16px' }}>
                {/* Analysis header */}
                <div style={{
                  padding: '16px 20px', borderBottom: '2px solid #8b2e2e',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '6px' }}>AI Campaign Analysis</div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)', margin: 0, lineHeight: 1.5 }}>
                      {analysis.summary}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', marginLeft: '24px', flexShrink: 0 }}>
                    <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '6px' }}>Portfolio grade</div>
                    <GradeBadge grade={analysis.portfolioGrade} />
                  </div>
                </div>

                {/* Alerts */}
                {analysis.alerts.length > 0 && (
                  <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--rule)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {analysis.alerts.map((alert, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{
                          ...MONO, fontSize: '9px', padding: '2px 6px', flexShrink: 0,
                          background: alert.type === 'critical' ? '#8b2e2e' : alert.type === 'warning' ? '#d4a017' : '#2d6a4f',
                          color: '#fbf7ee',
                        }}>{alert.type}</span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)' }}>{alert.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Priorities */}
                {analysis.priorities.length > 0 && (
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '12px' }}>Optimization priorities</div>
                    {analysis.priorities.map((p, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: '12px', alignItems: 'flex-start',
                        paddingBottom: i < analysis.priorities.length - 1 ? '10px' : 0,
                        marginBottom: i < analysis.priorities.length - 1 ? '10px' : 0,
                        borderBottom: i < analysis.priorities.length - 1 ? '1px solid var(--rule)' : 'none',
                      }}>
                        <span style={{
                          ...MONO, fontSize: '9px', padding: '2px 6px', flexShrink: 0, marginTop: '1px',
                          background: p.impact === 'high' ? '#8b2e2e' : p.impact === 'medium' ? '#d4a017' : 'var(--faint)',
                          color: '#fbf7ee',
                        }}>{p.impact}</span>
                        <div>
                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#1a1814', fontWeight: 500 }}>{p.action}</div>
                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--dim)', marginTop: '2px' }}>{p.why}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Data flywheel insight */}
            <div style={{ border: '1px solid var(--rule)', padding: '16px 20px', background: 'var(--paper)', borderLeft: '3px solid #8b2e2e' }}>
              <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '6px' }}>Data flywheel insight</div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)', lineHeight: 1.55, margin: 0 }}>
                Campaign with brain score 88 is delivering 5.1× ROAS vs 2.4× for score 71.
                Every campaign you run trains the prediction model. After 1,000 campaigns, the model knows what your specific audience's brain responds to — no competitor can buy that dataset.
              </p>
            </div>
          </div>

          {/* Score + launch */}
          <div>
            <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '16px' }}>Score + launch new ad</div>
            <form onSubmit={handleLaunch} style={{ border: '1px solid var(--rule)', borderTop: '2px solid #8b2e2e', padding: '24px', background: 'var(--paper)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label htmlFor="paid-creative" style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>
                  Your creative — hook, visual, script
                </label>
                <textarea
                  id="paid-creative"
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
                  <label htmlFor="paid-budget" style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>Daily budget (USD)</label>
                  <input
                    id="paid-budget"
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
                  <label htmlFor="paid-objective" style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>Objective</label>
                  <select id="paid-objective" style={{
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
                {launching ? 'Scoring…' : 'Score + launch →'}
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
