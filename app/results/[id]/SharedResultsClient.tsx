'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ContentConcept } from '@/lib/types'

const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }

const DIMENSIONS = [
  { key: 'rewardScore' as const,    label: 'Reward',    desc: 'Desire & surprise' },
  { key: 'attentionScore' as const, label: 'Attention', desc: 'Visual command' },
  { key: 'emotionScore' as const,   label: 'Emotion',   desc: 'Human connection' },
  { key: 'memoryScore' as const,    label: 'Memory',    desc: 'Lasting impression' },
]

interface Props {
  concept: ContentConcept
  shareId: string
  showRescore?: boolean
}

export default function SharedResultsClient({ concept, shareId, showRescore = false }: Props) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [tweaking, setTweaking] = useState(false)
  const [hook, setHook] = useState(concept.hook)
  const [imageDescription, setImageDescription] = useState(concept.imageDescription)
  const [videoScript, setVideoScript] = useState(concept.videoScript)
  const [rescoring, setRescoring] = useState(false)
  const [error, setError] = useState('')

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/results/${shareId}`
    : `/results/${shareId}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  async function handleRescore(e: React.FormEvent) {
    e.preventDefault()
    if (!hook.trim()) return
    setRescoring(true)
    setError('')
    try {
      const res = await fetch('/api/score-concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hook: hook.trim(), imageDescription: imageDescription.trim(), videoScript: videoScript.trim() }),
      })
      if (!res.ok) throw new Error((await res.json()).error || res.statusText)
      const data = await res.json()
      router.push(`/results/${data.shareId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scoring failed')
      setRescoring(false)
    }
  }

  const scoreColor = concept.overallScore >= 75 ? '#8b2e2e' : concept.overallScore >= 50 ? '#6a6258' : '#a39c8e'

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--rule)',
    padding: '8px 0',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    color: 'var(--ink)',
    outline: 'none',
  }

  return (
    <main style={{ minHeight: '100vh', padding: '64px 24px', maxWidth: '560px', margin: '0 auto', background: 'var(--bg)' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '16px' }}>Brain Score</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
          <div style={{ ...SERIF, fontSize: '96px', lineHeight: 0.85, fontVariantNumeric: 'tabular-nums', color: scoreColor }}>
            {concept.overallScore}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: 'var(--ink)', fontWeight: 500 }}>/100 overall</div>
            <div style={{ ...MONO, color: 'var(--faint)', marginTop: '4px' }}>TRIBE v2 brain encoding</div>
          </div>
        </div>
      </div>

      {/* Hook */}
      <div style={{ borderTop: '2px solid var(--ink)', borderBottom: '1px solid var(--rule)', padding: '20px 0', marginBottom: '32px' }}>
        <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '10px' }}>Hook</div>
        <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '26px', color: 'var(--ink)', margin: 0, lineHeight: 1.2 }}>
          &ldquo;{concept.hook}&rdquo;
        </p>
      </div>

      {/* Dimension scores */}
      <div style={{ marginBottom: '32px' }}>
        {DIMENSIONS.map(({ key, label, desc }, i) => {
          const s = concept[key]
          const c = s >= 75 ? '#8b2e2e' : s >= 50 ? '#6a6258' : '#a39c8e'
          const exKey = label.toLowerCase() as keyof typeof concept.explanations
          return (
            <div key={key} style={{ borderBottom: '1px solid var(--rule)', padding: '16px 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <span style={{ ...MONO, color: 'var(--ink)' }}>{label}</span>
                  <span style={{ ...MONO, color: 'var(--faint)', marginLeft: '8px' }}>{desc}</span>
                </div>
                <span style={{ ...SERIF, fontSize: '36px', lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: c }}>{s}</span>
              </div>
              {/* Score bar */}
              <div style={{ height: '2px', background: 'var(--rule)', marginBottom: '10px' }}>
                <div style={{ height: '100%', width: `${s}%`, background: c, transition: 'width 0.7s ease' }} />
              </div>
              {concept.explanations?.[exKey] && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)', lineHeight: 1.55, margin: 0 }}>
                  {concept.explanations[exKey]}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Suggestions */}
      {concept.suggestions && (
        <div style={{ border: '1px solid var(--rule)', borderTop: '2px solid #8b2e2e', marginBottom: '32px', padding: '24px' }}>
          <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '16px' }}>What the brain wants instead</div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '6px' }}>Stronger hook</div>
            <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '20px', color: 'var(--ink)', margin: 0, lineHeight: 1.3 }}>
              &ldquo;{concept.suggestions.improvedHook}&rdquo;
            </p>
          </div>
          <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '16px', marginBottom: '16px' }}>
            <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '8px' }}>Improved script</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)', lineHeight: 1.65, margin: 0 }}>
              {concept.suggestions.improvedScript}
            </p>
          </div>
          <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '12px' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--faint)', lineHeight: 1.5, margin: 0 }}>
              <strong style={{ color: 'var(--dim)' }}>Why it hits harder:</strong> {concept.suggestions.why}
            </p>
          </div>
        </div>
      )}

      {/* Share */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={handleCopy}
          style={{
            flex: 1,
            background: 'transparent',
            border: '1px solid var(--rule)',
            padding: '12px 16px',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            color: copied ? '#8b2e2e' : 'var(--dim)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M9 1H3a1 1 0 00-1 1v8M5 4h6a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {copied ? 'Copied!' : 'Copy share link'}
        </button>
        <a
          href={`/api/og/${shareId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 16px',
            border: '1px solid var(--rule)',
            color: 'var(--faint)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
          }}
          title="View score card image"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M1 9l3-3 2.5 2.5L9.5 5 13 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
      </div>

      {/* Tweak + re-score */}
      {showRescore && (
        <>
          {!tweaking ? (
            <button
              onClick={() => setTweaking(true)}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid var(--rule)',
                padding: '12px',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--dim)',
                cursor: 'pointer',
                marginBottom: '20px',
              }}
            >
              Tweak and re-score →
            </button>
          ) : (
            <form onSubmit={handleRescore} style={{ border: '1px solid var(--rule)', padding: '24px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ ...MONO, color: 'var(--faint)' }}>Edit your creative</div>

              <div>
                <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '6px' }}>Hook</label>
                <input type="text" value={hook} onChange={e => setHook(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '6px' }}>Visual</label>
                <textarea value={imageDescription} onChange={e => setImageDescription(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'none' }} />
              </div>
              <div>
                <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '6px' }}>Script</label>
                <textarea value={videoScript} onChange={e => setVideoScript(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'none' }} />
              </div>

              {error && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#c0392b' }}>{error}</p>}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={rescoring || !hook.trim()}
                  style={{
                    flex: 1,
                    background: rescoring || !hook.trim() ? 'var(--faint)' : 'var(--ink)',
                    color: '#fbf7ee',
                    border: 'none',
                    padding: '12px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    cursor: rescoring || !hook.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  {rescoring ? 'Scoring…' : 'Re-score →'}
                </button>
                <button
                  type="button"
                  onClick={() => setTweaking(false)}
                  style={{ padding: '12px 16px', background: 'transparent', border: '1px solid var(--rule)', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
        <a href="/score" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none' }}>← Score another</a>
        <a href="/" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none' }}>Analyze a brand</a>
      </div>

    </main>
  )
}
