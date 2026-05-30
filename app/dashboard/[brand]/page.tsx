'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import WinnerCard from '@/components/WinnerCard'
import LoserCard from '@/components/LoserCard'
import { AnalysisResult } from '@/lib/types'

const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }

export default function DashboardPage() {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('analysisResult')
    if (!stored) { router.push('/'); return }
    try {
      const parsed = JSON.parse(stored) as AnalysisResult
      if (!parsed?.brand || !Array.isArray(parsed?.concepts)) { router.push('/'); return }
      setResult(parsed)
    } catch {
      router.push('/')
      return
    }
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [router])

  if (!result) return null

  const sorted = [...result.concepts].sort((a, b) => b.overallScore - a.overallScore)
  const [winner, ...losers] = sorted

  const now = new Date()
  const runNum = Math.floor(Math.random() * 90000 + 10000)

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f4efe6',
      padding: '40px',
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(8px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '4fr 8fr', gap: '40px', minHeight: 'calc(100vh - 80px)' }}>

        {/* Left col */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Top */}
            <div style={{ ...MONO, color: '#8b2e2e', textDecoration: 'underline', letterSpacing: '0.18em', marginBottom: '12px' }}>
              The report on
            </div>
            <h1 style={{ ...SERIF, fontSize: '84px', color: '#1a1814', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
              {result.brand}
            </h1>
            <p style={{ ...MONO, color: '#a39c8e', letterSpacing: '0.18em', marginTop: '14px' }}>
              Run #{String(runNum).padStart(5, '0')} · {now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>

          {/* Mid */}
          <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '17px', color: '#6a6258', lineHeight: 1.55, margin: '32px 0' }}>
            One concept the brain takes home. Two it forgets by lunch.
          </p>

          {/* Bottom */}
          <button
            onClick={() => router.push('/')}
            style={{
              ...MONO, color: '#6a6258', background: 'none', border: 'none',
              cursor: 'pointer', padding: 0, textAlign: 'left', letterSpacing: '0.18em',
            }}
          >
            ← Scan another brand
          </button>
        </div>

        {/* Right col */}
        <div>
          <WinnerCard concept={winner} />
          <div style={{ marginTop: '16px' }}>
            {losers.map((c, i) => <LoserCard key={c.id} concept={c} index={i} />)}
          </div>
        </div>
      </div>
    </main>
  )
}
