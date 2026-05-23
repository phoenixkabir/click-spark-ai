'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import WinnerCard from '@/components/WinnerCard'
import LoserCard from '@/components/LoserCard'
import { AnalysisResult } from '@/lib/types'

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

  const sorted = [...result.concepts].sort((a, b) => b.tribeScore - a.tribeScore)
  const [winner, ...losers] = sorted

  return (
    <main className="min-h-screen px-6 py-10 max-w-lg mx-auto">
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-4 h-[2px] bg-[#00d68f]" />
            <div className="text-[11px] text-[#00d68f] font-semibold tracking-[0.2em] uppercase">
              Brain Attention Analysis
            </div>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight">{result.brand}</h1>
        </div>
        <div className="mb-4">
          <WinnerCard
            concept={winner}
            signalsProcessed={result.signalsProcessed}
            percentile={result.percentile}
          />
        </div>
        <div className="text-[10px] text-[#444] uppercase tracking-widest mb-3 mt-6">Other Concepts</div>
        <div className="flex flex-col gap-2">
          {losers.map(c => <LoserCard key={c.id} concept={c} />)}
        </div>
        <button
          onClick={() => router.push('/')}
          className="mt-8 text-[#555] text-sm hover:text-[#999] transition-colors"
        >
          ← Analyze another brand
        </button>
      </div>
    </main>
  )
}
