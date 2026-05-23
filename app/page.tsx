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
    try {
      router.push(`/analyze?url=${encodeURIComponent(url.trim())}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-block w-5 h-[2px] bg-[var(--accent)]" />
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[var(--accent)] uppercase">
            TRIBE v2 Brain Encoding
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[3.25rem] font-black leading-[1.1] tracking-tight text-white mb-4">
          Click Spark<br />
          <span className="text-[var(--accent)]">AI</span>
        </h1>

        {/* Subhead */}
        <p className="text-[#999] text-base leading-relaxed mb-10 max-w-sm">
          Brain-validated content concepts — scored before you spend a rupee.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              aria-label="Brand URL"
              placeholder="liquiddeath.com"
              required
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3.5 text-white placeholder-[var(--text-muted)] text-[15px] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full bg-[var(--accent)] text-black font-bold py-3.5 rounded-lg text-[15px] hover:bg-[var(--accent-hover)] disabled:bg-[#1a2e23] disabled:text-[#3a6b4e] disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Analyzing…' : 'Analyze →'}
          </button>
        </form>

        {/* Meta */}
        <p className="mt-5 text-[var(--text-dim)] text-xs">
          3 concepts &middot; TRIBE v2 scores &middot; Ready in seconds
        </p>
      </div>
    </main>
  )
}
