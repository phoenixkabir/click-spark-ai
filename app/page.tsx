'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    router.push(`/analyze?url=${encodeURIComponent(url.trim())}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <div className="mb-3 text-xs font-semibold tracking-[0.2em] text-[#00d68f] uppercase">
          Powered by TRIBE v2 Brain Encoding
        </div>
        <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
          Click Spark <span className="text-[#00d68f]">AI</span>
        </h1>
        <p className="text-[#888] text-lg mb-10 leading-relaxed">
          Brain-validated content.<br />
          Before you spend a rupee.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Enter your brand URL — e.g. liquiddeath.com"
            required
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-5 py-4 text-white placeholder-[#555] text-base focus:outline-none focus:border-[#00d68f] transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full bg-[#00d68f] text-black font-bold py-4 rounded-xl text-base hover:bg-[#00f0a0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze →'}
          </button>
        </form>
        <p className="mt-6 text-[#444] text-sm">
          3 content concepts · TRIBE v2 brain scores · Ready in seconds
        </p>
      </div>
    </main>
  )
}
