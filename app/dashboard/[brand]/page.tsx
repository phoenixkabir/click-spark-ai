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
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="mb-8">
          <div className="text-xs text-[#00d68f] font-semibold tracking-widest uppercase mb-2">
            Brain Attention Analysis
          </div>
          <h1 className="text-2xl font-black text-white">{result.brand}</h1>
        </div>
        <div className="mb-6">
          <WinnerCard
            concept={winner}
            signalsProcessed={result.signalsProcessed}
            percentile={result.percentile}
          />
        </div>
        <div className="text-xs text-[#444] uppercase tracking-widest mb-3">Other Concepts</div>
        <div className="flex flex-col gap-3">
          {losers.map(c => <LoserCard key={c.id} concept={c} />)}
        </div>
        <button
          onClick={() => router.push('/')}
          className="mt-8 text-[#444] text-sm hover:text-[#888] transition-colors"
        >
          ← Analyze another brand
        </button>
      </div>
    </main>
  )
}
