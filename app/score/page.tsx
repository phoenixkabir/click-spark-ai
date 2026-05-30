'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }

const NODES = [
  { x: 50, y: 12 },
  { x: 20, y: 35 },
  { x: 80, y: 35 },
  { x: 10, y: 62 },
  { x: 42, y: 58 },
  { x: 72, y: 55 },
  { x: 90, y: 68 },
  { x: 28, y: 80 },
  { x: 58, y: 82 },
]

const EDGES = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6],
  [3, 7], [4, 5], [4, 7], [4, 8], [5, 6], [5, 8], [7, 8],
]

function BrainAnimation() {
  return (
    <div style={{ width: '120px', height: '100px', position: 'relative', margin: '0 auto 28px' }}>
      <svg viewBox="0 0 100 95" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <style>{`
          @keyframes pulse-edge {
            0%, 100% { opacity: 0.08; }
            50% { opacity: 0.5; }
          }
          @keyframes pulse-node {
            0%, 100% { r: 3; opacity: 0.3; }
            50% { r: 5; opacity: 1; }
          }
          .edge { animation: pulse-edge 2.4s ease-in-out infinite; }
          .node { animation: pulse-node 2s ease-in-out infinite; }
          .edge:nth-child(2) { animation-delay: 0.2s; }
          .edge:nth-child(3) { animation-delay: 0.4s; }
          .edge:nth-child(4) { animation-delay: 0.6s; }
          .edge:nth-child(5) { animation-delay: 0.8s; }
          .edge:nth-child(6) { animation-delay: 1.0s; }
          .edge:nth-child(7) { animation-delay: 1.2s; }
          .edge:nth-child(8) { animation-delay: 1.4s; }
          .edge:nth-child(9) { animation-delay: 1.6s; }
          .edge:nth-child(10) { animation-delay: 1.8s; }
          .edge:nth-child(11) { animation-delay: 0.3s; }
          .edge:nth-child(12) { animation-delay: 0.9s; }
          .edge:nth-child(13) { animation-delay: 1.5s; }
          .node:nth-child(1) { animation-delay: 0s; }
          .node:nth-child(2) { animation-delay: 0.3s; }
          .node:nth-child(3) { animation-delay: 0.6s; }
          .node:nth-child(4) { animation-delay: 0.9s; }
          .node:nth-child(5) { animation-delay: 1.2s; }
          .node:nth-child(6) { animation-delay: 0.2s; }
          .node:nth-child(7) { animation-delay: 0.5s; }
          .node:nth-child(8) { animation-delay: 0.8s; }
          .node:nth-child(9) { animation-delay: 1.1s; }
        `}</style>
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            className="edge"
            x1={NODES[a].x} y1={NODES[a].y}
            x2={NODES[b].x} y2={NODES[b].y}
            stroke="#8b2e2e"
            strokeWidth="1"
          />
        ))}
        {NODES.map((n, i) => (
          <circle
            key={i}
            className="node"
            cx={n.x}
            cy={n.y}
            r={3}
            fill="#8b2e2e"
          />
        ))}
      </svg>
    </div>
  )
}

const LOADING_STEPS = [
  'Parsing your creative…',
  'Reading through 70,000 cortical regions…',
  'Scoring Reward pathways…',
  'Scoring Attention + Emotion networks…',
  'Encoding Memory traces…',
  'Generating your improvement brief…',
]

export default function ScorePage() {
  const router = useRouter()
  const [creative, setCreative] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, GIF, WebP)')
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = e => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
    setError('')
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!creative.trim()) return
    setLoading(true)
    setError('')
    setLoadingStep(0)

    stepTimerRef.current = setInterval(() => {
      setLoadingStep(s => Math.min(s + 1, LOADING_STEPS.length - 1))
    }, 2200)

    try {
      const body: Record<string, string> = { creative: creative.trim() }
      if (videoUrl.trim()) body.videoUrl = videoUrl.trim()
      if (imagePreview) body.imageBase64 = imagePreview

      const res = await fetch('/api/score-concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).error || res.statusText)
      const { shareId, ...concept } = await res.json()
      sessionStorage.setItem('scoredConcept', JSON.stringify(concept))
      sessionStorage.setItem('scoredConceptShareId', shareId)
      router.push(`/results/${shareId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scoring failed')
      setLoading(false)
      if (stepTimerRef.current) clearInterval(stepTimerRef.current)
    }
  }

  if (loading) {
    return (
      <main style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', padding: '40px 24px',
      }}>
        <BrainAnimation />
        <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '20px', textAlign: 'center' }}>
          TRIBE v2 · neural encoding
        </div>
        <div style={{ ...SERIF, fontSize: '28px', color: '#1a1814', textAlign: 'center', marginBottom: '12px', lineHeight: 1.2 }}>
          {LOADING_STEPS[loadingStep]}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
          {LOADING_STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === loadingStep ? '20px' : '6px',
              height: '6px',
              background: i <= loadingStep ? '#8b2e2e' : 'var(--rule)',
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--faint)', marginTop: '32px', textAlign: 'center' }}>
          Usually 15–25 seconds
        </p>
      </main>
    )
  }

  const canSubmit = creative.trim().length > 0

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1a1814', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '6px', textDecoration: 'none' }}>
          <span style={{ color: '#8b2e2e', ...SERIF, fontSize: '18px' }}>◆</span>
          <span style={{ ...SERIF, fontSize: '18px', color: '#1a1814' }}>Click Spark<span style={{ color: '#8b2e2e' }}>.</span></span>
        </a>
        <a href="/" style={{ ...MONO, color: '#a39c8e', textDecoration: 'none', letterSpacing: '0.18em' }}>← Back</a>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '56px 24px' }}>
        <div style={{ width: '100%', maxWidth: '640px' }}>

          <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '20px' }}>Score Your Creative</div>
          <h1 style={{ ...SERIF, fontSize: '52px', lineHeight: 1.0, color: '#1a1814', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Paste your script.<br />
            <em>See the brain score.</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--dim)', lineHeight: 1.6, margin: '0 0 40px', maxWidth: '480px' }}>
            Drop your hook, visuals, and script in one block — or just a single line. TRIBE v2 scores how deeply it encodes across Reward, Attention, Emotion, and Memory. Then we tell you exactly how to make it stronger.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Main creative input */}
            <div>
              <label htmlFor="creative-input" style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>
                Your creative — <span style={{ color: 'var(--dim)' }}>hook, visual, script — or just paste everything</span>
              </label>
              <textarea
                id="creative-input"
                value={creative}
                onChange={e => setCreative(e.target.value)}
                placeholder={`e.g.

Hook: "You're not drinking water. You're refusing to be boring."

Visual: Person at a crowded party, standing out with Liquid Death while everyone else has generic drinks.

Script: Open on a crowded house party. Zoom in on one person — confident, totally unbothered. Cut to their hand. It's a black can. Text: Refuse to be boring.`}
                rows={9}
                required
                style={{
                  width: '100%',
                  background: '#fbf7ee',
                  border: '1px solid rgba(26,24,20,0.15)',
                  borderTop: '2px solid #1a1814',
                  padding: '16px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  color: 'var(--ink)',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: 1.6,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Media upload row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              {/* Image upload */}
              <div>
                <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>
                  Image — <span style={{ color: 'var(--dim)' }}>optional · vision scoring</span>
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  style={{
                    border: '1px dashed rgba(26,24,20,0.25)',
                    padding: imagePreview ? '0' : '20px 16px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: '#fbf7ee',
                    overflow: 'hidden',
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="upload" style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }} />
                      <button
                        type="button"
                        onClick={ev => { ev.stopPropagation(); setImageFile(null); setImagePreview(null) }}
                        style={{
                          position: 'absolute', top: '6px', right: '6px',
                          background: '#1a1814', color: '#fbf7ee',
                          border: 'none', width: '20px', height: '20px',
                          cursor: 'pointer', fontSize: '11px', lineHeight: '20px',
                        }}
                      >×</button>
                    </>
                  ) : (
                    <span style={{ ...MONO, color: 'var(--faint)' }}>
                      Drop image or click to upload
                    </span>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                />
              </div>

              {/* Video URL */}
              <div>
                <label style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>
                  Video URL — <span style={{ color: 'var(--dim)' }}>optional · YouTube, TikTok</span>
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  style={{
                    width: '100%',
                    background: '#fbf7ee',
                    border: '1px dashed rgba(26,24,20,0.25)',
                    padding: '16px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'var(--ink)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                  }}
                />
              </div>
            </div>

            {error && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#c0392b' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                background: canSubmit ? '#1a1814' : 'var(--faint)',
                color: '#fbf7ee',
                border: 'none',
                padding: '16px 24px',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                letterSpacing: '0.02em',
                transition: 'background 0.15s',
              }}
            >
              Score my creative →
            </button>

          </form>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--faint)' }}>
              15–25 sec · powered by TRIBE v2 fMRI weights
            </p>
            <a href="/sample" style={{ ...MONO, color: 'var(--faint)', textDecoration: 'underline', letterSpacing: '0.18em' }}>
              See a sample →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
