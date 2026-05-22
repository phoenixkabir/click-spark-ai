'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LoadingSteps from '@/components/LoadingSteps'

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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center mb-12">
        <div className="text-xs font-semibold tracking-[0.2em] text-[#00d68f] uppercase mb-3">
          Analyzing
        </div>
        <h2 className="text-2xl font-bold text-white">
          {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </h2>
      </div>
      <LoadingSteps onComplete={handleComplete} analysisComplete={analysisComplete} />
      <p className="mt-12 text-[#444] text-xs">
        Powered by Meta TRIBE v2 · 720 subjects · 70,000 brain regions
      </p>
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
