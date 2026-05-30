'use client'

import { useState } from 'react'

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }
const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }
const SANS: React.CSSProperties = { fontFamily: 'var(--font-sans)' }

interface UGCScript {
  persona: string
  platform: string
  hook: string
  body: string
  cta: string
  brainScore: number | null
  angle: string
}

const DEMO_ACCOUNTS = [
  { handle: '@dailygrind.co', platform: 'TikTok', videos: 4, views: '23.4K', followers: '12.1K', engagement: '6.2%', status: 'LIVE' },
  { handle: '@buildershub', platform: 'Instagram Reels', videos: 5, views: '38.8K', followers: '8.4K', engagement: '4.1%', status: 'LIVE' },
  { handle: '@founder.feed', platform: 'TikTok', videos: 3, views: '21.6K', followers: '5.2K', engagement: '5.8%', status: 'LIVE' },
]

const PIPELINE_STAGES = [
  {
    num: '01',
    label: 'Ideation',
    desc: 'Brief in. AI generates angles, hooks, and personas tuned to your audience.',
    status: 'live',
    model: 'Smart scripting',
  },
  {
    num: '02',
    label: 'Scripting',
    desc: 'Creator-native scripts — not branded, not polished. Built to feel organic on each platform.',
    status: 'live',
    model: 'Smart scripting',
  },
  {
    num: '03',
    label: 'Video Generation',
    desc: 'AI avatars bring the script to life. Realistic creators, right platform format, zero production time.',
    status: 'waitlist',
    model: 'Creator-ready video',
  },
  {
    num: '04',
    label: 'Editing & Post',
    desc: 'Auto-cut, captions, B-roll, music — all handled. Ready to publish.',
    status: 'waitlist',
    model: 'Studio post-production',
  },
  {
    num: '05',
    label: 'Brain Score & Publish',
    desc: 'Every video scored before it goes live. Only the ones that pass get published.',
    status: 'waitlist',
    model: 'Neuro-scored · auto-publish',
  },
]

export default function UGCEnginePage() {
  const [brief, setBrief] = useState('')
  const [scripts, setScripts] = useState<UGCScript[]>([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!brief.trim()) return
    setGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/generate-ugc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief: brief.trim() }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Generation failed')
      const data = await res.json()
      setScripts(data.scripts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid #1a1814',
        padding: '16px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/dashboard" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none' }}>← Dashboard</a>
          <span style={{ ...MONO, color: 'var(--faint)' }}>/</span>
          <span style={{ ...MONO, color: '#6a6258' }}>AI UGC Engine</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/dashboard/paid" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none', padding: '8px 0', minHeight: '44px', display: 'flex', alignItems: 'center' }}>Paid →</a>
          <a href="/dashboard/organic" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none', padding: '8px 0', minHeight: '44px', display: 'flex', alignItems: 'center' }}>Organic →</a>
        </div>
      </nav>

      <div style={{ padding: '48px 40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px', maxWidth: '680px' }}>
          <div style={{ ...MONO, color: '#6a6258', marginBottom: '8px' }}>02 · AI UGC Engine</div>
          <h1 style={{ ...SERIF, fontSize: '52px', lineHeight: 1, color: '#1a1814', margin: '0 0 12px' }}>
            The Subconscious Layer.
          </h1>
          <p style={{ ...SANS, fontSize: '15px', color: 'var(--dim)', lineHeight: 1.65, margin: '0 0 8px' }}>
            The full UGC production pipeline — ideation to scripting to video generation to editing to publish — handled end to end inside ClipSpark AI.
          </p>
          <p style={{ ...SANS, fontSize: '14px', color: 'var(--faint)', lineHeight: 1.6, margin: 0 }}>
            Every stage powered by the best model for that job. Brief in, brain-scored video out. No agency, no freelancers, no back and forth.
          </p>
        </div>

        {/* Pipeline overview */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '16px' }}>Full pipeline · ideation → publish</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(160px, 1fr))', border: '1px solid var(--rule)', background: 'var(--paper)', overflowX: 'auto' }}>
            {PIPELINE_STAGES.map((stage, i) => (
              <div
                key={stage.num}
                style={{
                  padding: '20px',
                  borderRight: i < PIPELINE_STAGES.length - 1 ? '1px solid var(--rule)' : 'none',
                  borderTop: `2px solid ${stage.status === 'live' ? '#6a6258' : 'rgba(26,24,20,0.12)'}`,
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{ ...MONO, color: stage.status === 'live' ? '#6a6258' : 'var(--faint)' }}>{stage.num}</span>
                  {stage.status === 'live' ? (
                    <span style={{ ...MONO, fontSize: '8px', color: '#6a6258', background: 'rgba(106,98,88,0.08)', padding: '2px 6px' }}>Live</span>
                  ) : (
                    <span style={{ ...MONO, fontSize: '8px', color: 'var(--faint)', background: 'rgba(26,24,20,0.05)', padding: '2px 6px' }}>Soon</span>
                  )}
                </div>
                <div style={{ ...SANS, fontSize: '13px', fontWeight: 600, color: '#1a1814', marginBottom: '6px' }}>{stage.label}</div>
                <div style={{ ...SANS, fontSize: '12px', color: 'var(--dim)', lineHeight: 1.5, marginBottom: '10px' }}>{stage.desc}</div>
                <div style={{ ...MONO, fontSize: '9px', color: 'var(--faint)', borderTop: '1px solid var(--rule)', paddingTop: '8px' }}>{stage.model}</div>
              </div>
            ))}
          </div>

          {/* Waitlist CTA for upcoming stages */}
          <div style={{
            marginTop: '0',
            border: '1px solid var(--rule)',
            borderTop: 'none',
            background: '#1a1814',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <span style={{ ...MONO, color: '#a39c8e', marginRight: '16px' }}>Stages 03–05 · Video gen, editing, and publish</span>
              <span style={{ ...SANS, fontSize: '13px', color: '#6a6258' }}>Early access cohort forming now</span>
            </div>
            <a
              href="/waitlist"
              style={{
                ...MONO, color: '#fbf7ee',
                background: '#8b2e2e',
                border: 'none', padding: '8px 18px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Join the waitlist →
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '40px', alignItems: 'start' }}>

          {/* Generate scripts */}
          <div>
            <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '4px' }}>Stage 01–02 · Live now</div>
            <div style={{ ...MONO, color: '#6a6258', marginBottom: '16px', fontSize: '12px' }}>Ideation + scripting</div>
            <form onSubmit={handleGenerate} style={{ border: '1px solid var(--rule)', borderTop: '2px solid #6a6258', padding: '24px', background: 'var(--paper)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label htmlFor="ugc-brief" style={{ ...MONO, color: 'var(--faint)', display: 'block', marginBottom: '8px' }}>
                  Brand brief — product, audience, tone, key message
                </label>
                <textarea
                  id="ugc-brief"
                  value={brief}
                  onChange={e => setBrief(e.target.value)}
                  placeholder={`e.g.

Brand: Liquid Death
Product: Canned mountain water (355ml, 500ml)
Audience: 18-35, anti-mainstream, punk aesthetic
Key message: Water doesn't have to be boring
Tone: Irreverent, dark humor, anti-corporate

Generate 3 UGC scripts for TikTok and Instagram Reels.`}
                  rows={10}
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

              {error && <p style={{ ...SANS, fontSize: '13px', color: '#c0392b' }}>{error}</p>}

              <button
                type="submit"
                disabled={generating || !brief.trim()}
                style={{
                  background: generating || !brief.trim() ? 'var(--faint)' : '#6a6258',
                  color: '#fbf7ee', border: 'none', padding: '14px',
                  fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500,
                  cursor: generating || !brief.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {generating ? 'Generating scripts…' : 'Generate 3 UGC scripts →'}
              </button>

              <p style={{ ...MONO, color: 'var(--faint)', margin: 0, lineHeight: 1.6 }}>
                Scripts ready · join waitlist to send straight to video generation
              </p>
            </form>

            {/* Creator accounts */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '16px' }}>Active creator accounts</div>
              <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)' }}>
                {DEMO_ACCOUNTS.map((acc, i) => (
                  <div key={acc.handle} style={{
                    padding: '16px 20px',
                    borderBottom: i < DEMO_ACCOUNTS.length - 1 ? '1px solid var(--rule)' : 'none',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <span style={{ ...SANS, fontSize: '13px', color: '#1a1814', fontWeight: 500 }}>{acc.handle}</span>
                        <span style={{ ...MONO, color: 'var(--faint)', marginLeft: '10px' }}>{acc.platform}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6a6258', display: 'inline-block' }} />
                        <span style={{ ...MONO, color: '#6a6258', fontSize: '9px' }}>{acc.status}</span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {[['Videos', acc.videos.toString()], ['Views', acc.views], ['Followers', acc.followers], ['Engagement', acc.engagement]].map(([l, v]) => (
                        <div key={l}>
                          <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '2px' }}>{l}</div>
                          <div style={{ ...SANS, fontSize: '13px', color: '#1a1814' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ ...MONO, color: 'var(--faint)', marginTop: '12px', lineHeight: 1.6 }}>
                AI avatars · accounts managed by ClipSpark AI · native-feel content only
              </p>
            </div>
          </div>

          {/* Scripts output */}
          <div>
            {scripts.length === 0 ? (
              <div style={{ border: '1px dashed rgba(26,24,20,0.15)', padding: '60px 40px', textAlign: 'center' }}>
                <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '12px' }}>Scripts will appear here</div>
                <p style={{ ...SANS, fontSize: '14px', color: 'var(--dim)', lineHeight: 1.6 }}>
                  Enter your brief and get 3 creator-native scripts — each with a unique angle, persona, and platform format. Brain-score each one before sending to video generation.
                </p>
                {/* Demo preview */}
                <div style={{ marginTop: '32px', textAlign: 'left', border: '1px solid var(--rule)', padding: '20px', background: 'var(--paper)' }}>
                  <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '12px' }}>Sample output</div>
                  {[
                    { persona: '@partykid_aesthetic', platform: 'TikTok · 9:16', angle: 'Social proof', hook: '"Wait, that\'s just water??"' },
                    { persona: '@gymrat.daily', platform: 'Reels · 9:16', angle: 'Identity play', hook: '"The gym water that gets asked about"' },
                    { persona: '@anticorporate.life', platform: 'TikTok · 9:16', angle: 'Anti-mainstream', hook: '"Boycott boring water"' },
                  ].map(({ persona, platform, angle, hook }) => (
                    <div key={persona} style={{ padding: '12px 0', borderBottom: '1px solid var(--rule)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ ...SANS, fontSize: '12px', color: '#1a1814', fontWeight: 500 }}>{persona}</span>
                        <span style={{ ...MONO, color: 'var(--faint)' }}>{platform}</span>
                      </div>
                      <div style={{ ...MONO, color: '#6a6258', marginBottom: '4px' }}>{angle}</div>
                      <div style={{ ...SANS, fontSize: '13px', color: 'var(--dim)', fontStyle: 'italic' }}>{hook}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '4px' }}>{scripts.length} scripts generated · each brain scored</div>
                {scripts.map((script, i) => (
                  <div key={i} style={{ border: '1px solid var(--rule)', borderTop: '2px solid #6a6258', padding: '24px', background: 'var(--paper)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <div style={{ ...MONO, color: '#6a6258', marginBottom: '4px' }}>{script.persona} · {script.platform}</div>
                        <div style={{ ...SANS, fontSize: '12px', color: 'var(--dim)' }}>Angle: {script.angle}</div>
                      </div>
                      {script.brainScore !== null && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ ...SERIF, fontSize: '32px', color: '#6a6258', lineHeight: 1 }}>{script.brainScore}</div>
                          <div style={{ ...MONO, color: 'var(--faint)' }}>brain score</div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ borderLeft: '2px solid #8b2e2e', paddingLeft: '12px' }}>
                        <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '4px' }}>Hook</div>
                        <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '18px', color: '#1a1814', margin: 0, lineHeight: 1.3 }}>
                          &ldquo;{script.hook}&rdquo;
                        </p>
                      </div>
                      <div>
                        <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '4px' }}>Body</div>
                        <p style={{ ...SANS, fontSize: '13px', color: 'var(--dim)', lineHeight: 1.65, margin: 0 }}>
                          {script.body}
                        </p>
                      </div>
                      <div>
                        <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '4px' }}>CTA</div>
                        <p style={{ ...SANS, fontSize: '13px', color: 'var(--ink)', margin: 0 }}>
                          {script.cta}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid var(--rule)', paddingTop: '16px' }}>
                      <a
                        href="/waitlist"
                        style={{ ...MONO, color: '#fbf7ee', background: '#6a6258', border: 'none', padding: '8px 14px', cursor: 'pointer', textDecoration: 'none' }}
                      >
                        Send to video gen →
                      </a>
                      <button
                        onClick={() => navigator.clipboard.writeText(`${script.hook}\n\n${script.body}\n\n${script.cta}`)}
                        style={{ ...MONO, color: 'var(--dim)', background: 'transparent', border: '1px solid var(--rule)', padding: '8px 14px', cursor: 'pointer' }}
                      >
                        Copy script
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
