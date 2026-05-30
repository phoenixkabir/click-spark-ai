'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LoadingSteps from '@/components/LoadingSteps'

const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.22em' }

function AnalyzeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const url = searchParams.get('url') || ''

  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [brandName, setBrandName] = useState<string>('')

  useEffect(() => {
    if (!url) { router.push('/'); return }

    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() })
      .then(data => {
        sessionStorage.setItem('analysisResult', JSON.stringify(data))
        setBrandName(data.brand || 'brand')
        setAnalysisComplete(true)
      })
      .catch(() => router.push('/'))
  }, [url, router])

  const handleComplete = useCallback(() => {
    router.push(`/dashboard/${encodeURIComponent(brandName || 'brand')}`)
  }, [brandName, router])

  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <main style={{ minHeight: '100vh', background: '#f4efe6', display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '48px', padding: '40px', width: '100%', alignItems: 'center' }}>

        {/* Left */}
        <div>
          <p style={{ ...MONO, color: '#8b2e2e', marginBottom: '18px' }}>Now reading</p>
          <h1 style={{ ...SERIF, fontSize: '76px', color: '#1a1814', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
            {displayUrl || 'Loading…'}
          </h1>
          <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '19px', color: '#6a6258', marginTop: '24px', lineHeight: 1.55 }}>
            Give it about ninety seconds. We promise it&rsquo;s doing real work — not loading spinners pretending.
          </p>
        </div>

        {/* Right — steps */}
        <div>
          <div style={{ borderTop: '1px solid #1a1814', borderBottom: '1px solid #1a1814' }}>
            <LoadingSteps onComplete={handleComplete} analysisComplete={analysisComplete} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default function AnalyzePage() {
  return (
    <Suspense>
      <AnalyzeContent />
    </Suspense>
  )
}
