'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MARQUEE_ITEMS = [
  '720 real subjects',
  '70,000 cortical regions',
  '1,200 hrs of fMRI',
  'reward · emotion · attention · memory',
  'TRIBE v2 · neural encoding model',
  '90-second turnaround',
  '3 concepts, ranked',
  'one run per day',
]

const SCORE_BARS = [
  { label: 'Reward', val: 94 },
  { label: 'Emotion', val: 88 },
  { label: 'Attention', val: 92 },
  { label: 'Memory', val: 86 },
]

const DIMENSIONS = [
  {
    num: '01',
    label: 'Reward',
    pct: '30%',
    quote: '"I want to share this."',
    body: 'Fires when the hook promises a payoff in the first two seconds. The signal that decides if a brain leans in or scrolls past.',
    region: 'Orbitofrontal cortex',
  },
  {
    num: '02',
    label: 'Emotion',
    pct: '25%',
    quote: '"I feel this."',
    body: 'Fires when a face reacts on camera or a beat lands with the cut. The signal that turns an ad into a feeling instead of a message.',
    region: 'Insula + cingulate',
  },
  {
    num: '03',
    label: 'Attention',
    pct: '25%',
    quote: '"I can\'t look away."',
    body: 'Fires when the edit refuses to let the eye rest. The signal that decides whether the next five seconds get watched at all.',
    region: 'Parietal + frontal',
  },
  {
    num: '04',
    label: 'Memory',
    pct: '20%',
    quote: '"I\'ll remember this."',
    body: 'Fires when the close calls back to the open. The signal that decides if the brand survives until the next morning.',
    region: 'Parahippocampal + DMN',
  },
]

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.20em' }
const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }

function SectionRule({ num, title }: { num: string; title: string }) {
  return (
    <div style={{
      borderTop: '1px solid #1a1814',
      borderBottom: '1px solid var(--rule)',
      padding: '14px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={{ ...MONO, color: '#6a6258' }}>
        <span style={{ color: '#8b2e2e', marginRight: '10px' }}>§ {num}</span>
        {title}
      </span>
      <span style={{ ...MONO, color: '#6a6258' }}>Click Spark Quarterly · Iss. 04</span>
    </div>
  )
}

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

  const marqueeContent = [
    ...MARQUEE_ITEMS.map((item, i) => (
      <span key={`a${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '18px' }}>
        <span style={{ ...MONO, color: '#6a6258', letterSpacing: '0.22em' }}>{item}</span>
        <span style={{ color: '#8b2e2e', fontSize: '10px', marginRight: '18px' }}>◆</span>
      </span>
    )),
    ...MARQUEE_ITEMS.map((item, i) => (
      <span key={`b${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '18px' }}>
        <span style={{ ...MONO, color: '#6a6258', letterSpacing: '0.22em' }}>{item}</span>
        <span style={{ color: '#8b2e2e', fontSize: '10px', marginRight: '18px' }}>◆</span>
      </span>
    )),
  ]

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4efe6' }}>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid #1a1814',
        padding: '18px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        background: '#f4efe6',
        zIndex: 100,
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ color: '#8b2e2e', ...SERIF, fontSize: '18px' }}>◆</span>
          <span style={{ ...SERIF, fontSize: '18px', color: '#1a1814' }}>
            Click Spark<span style={{ color: '#8b2e2e' }}>.</span>
          </span>
          <span style={{ ...MONO, color: '#a39c8e', fontSize: '10px', letterSpacing: '0.18em', marginLeft: '2px' }}>v2 · TRIBE</span>
        </div>

        {/* Center */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {([
            ['The method', '#how-it-works'],
            ['Sample report', '/sample'],
            ['Proof', '/coming-soon'],
            ['Pricing', '/coming-soon'],
          ] as [string, string][]).map(([l, href]) => (
            <a key={l} href={href} style={{ ...MONO, color: '#a39c8e', textDecoration: 'none', letterSpacing: '0.18em' }}>{l}</a>
          ))}
        </div>

        {/* Right */}
        <a href="/waitlist" style={{
          ...MONO,
          color: '#fbf7ee',
          background: '#1a1814',
          border: 'none',
          padding: '10px 14px',
          textDecoration: 'none',
          letterSpacing: '0.16em',
          display: 'inline-block',
        }}>Get access →</a>
      </nav>

      {/* Hero */}
      <section style={{ padding: '56px 40px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '56px', alignItems: 'start' }}>

          {/* Left col */}
          <div>
            {/* Eyebrow */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{ ...MONO, color: '#8b2e2e', letterSpacing: '0.22em', borderBottom: '1px solid #8b2e2e', paddingBottom: '2px' }}>
                fMRI-trained · peer-reviewed weights
              </span>
            </div>

            {/* H1 */}
            <h1 style={{ ...SERIF, fontSize: '108px', lineHeight: 0.92, letterSpacing: '-0.025em', margin: 0 }}>
              <span style={{ color: '#1a1814', display: 'block' }}>Anyone can ship.</span>
              <em style={{ color: '#8b2e2e', fontStyle: 'italic', display: 'block' }}>Almost no one</em>
              <span style={{ color: '#6a6258', display: 'block' }}>gets remembered.</span>
            </h1>

            {/* Body */}
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', color: '#6a6258', lineHeight: 1.55, maxWidth: '520px', marginTop: '28px' }}>
              The first tool that grades an ad before it runs — against the four brain networks that actually decide what gets remembered. Hand us a brand; ninety seconds later you have three concepts, ranked by how strongly 720 brains and 70,000 regions reacted. Reward, emotion, attention, memory. Each scored every second.
            </p>

            {/* URL input row */}
            <form onSubmit={handleSubmit} style={{ marginTop: '28px', maxWidth: '540px' }}>
              <div style={{
                borderTop: '1px solid #1a1814',
                borderBottom: '1px solid #1a1814',
                display: 'flex',
                alignItems: 'stretch',
              }}>
                <span style={{
                  ...MONO, color: '#a39c8e', letterSpacing: '0.20em',
                  padding: '0 14px',
                  display: 'flex', alignItems: 'center',
                  borderRight: 'none',
                  whiteSpace: 'nowrap',
                }}>URL —</span>
                <input
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="patagonia.com"
                  required
                  style={{
                    flex: 1,
                    padding: '16px 0',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    ...SERIF,
                    fontSize: '22px',
                    color: '#1a1814',
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  style={{
                    background: '#8b2e2e',
                    color: '#fbf7ee',
                    border: 'none',
                    padding: '0 22px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                    opacity: loading || !url.trim() ? 0.5 : 1,
                  }}
                >
                  Generate concepts →
                </button>
              </div>
            </form>

            {/* Meta line */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', maxWidth: '540px' }}>
              <span style={{ ...MONO, color: '#a39c8e', letterSpacing: '0.18em' }}>TRIBE v2  ·  720 subjects  ·  70,000 regions</span>
              <span style={{ ...MONO, color: '#a39c8e', letterSpacing: '0.18em' }}>
                or  <a href="/sample" style={{ color: '#a39c8e', textDecoration: 'underline' }}>see a sample report ↗</a>
              </span>
            </div>
          </div>

          {/* Right col — live score card */}
          <div style={{ borderLeft: '1px solid var(--rule)' }}>
            <div style={{
              background: '#fbf7ee',
              border: '1px solid #1a1814',
              padding: '20px 22px',
            }}>
              {/* Card header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid var(--rule)', paddingBottom: '10px', marginBottom: '14px',
              }}>
                <span style={{ ...MONO, color: '#a39c8e', letterSpacing: '0.20em' }}>Live · brain score</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', ...MONO, color: '#a39c8e', letterSpacing: '0.20em' }}>
                  <span style={{ width: '6px', height: '6px', background: '#8b2e2e', borderRadius: '50%', display: 'inline-block' }} />
                  reading · 23 May
                </span>
              </div>

              {/* Score row */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '18px' }}>
                <span style={{ ...SERIF, fontSize: '132px', color: '#8b2e2e', lineHeight: 0.85, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>91</span>
                <div style={{ paddingBottom: '8px' }}>
                  <div style={{ ...SERIF, fontStyle: 'italic', fontSize: '22px', color: '#1a1814' }}>high recall</div>
                  <div style={{ ...MONO, color: '#a39c8e', letterSpacing: '0.20em', marginTop: '4px' }}>94th percentile · n=720</div>
                </div>
              </div>

              {/* Sub-rows */}
              <div style={{ borderTop: '1px solid #1a1814', marginTop: '14px' }}>
                {SCORE_BARS.map(({ label, val }, i) => (
                  <div key={label} style={{
                    display: 'grid', gridTemplateColumns: '110px 1fr 56px', gap: '12px',
                    padding: '10px 0',
                    borderBottom: i < SCORE_BARS.length - 1 ? '1px solid var(--rule)' : 'none',
                    alignItems: 'center',
                  }}>
                    <span style={{ ...SERIF, fontSize: '16px', color: '#1a1814' }}>{label}</span>
                    <div style={{ height: '6px', background: 'rgba(26,24,20,0.05)' }}>
                      <div style={{ height: '100%', width: `${val}%`, background: '#8b2e2e' }} />
                    </div>
                    <span style={{ ...SERIF, fontSize: '22px', fontVariantNumeric: 'tabular-nums', color: '#1a1814', textAlign: 'right' }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Footer caption */}
              <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '13px', color: '#6a6258', marginTop: '14px' }}>
                Concept: &ldquo;Old gear has the best stories.&rdquo; · scored against 70,000 cortical regions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div style={{
        borderTop: '1px solid #1a1814', borderBottom: '1px solid #1a1814',
        background: '#fbf7ee',
        padding: '14px 0',
        overflow: 'hidden',
      }}>
        <div
          style={{ display: 'flex', width: 'max-content', animation: 'marquee 35s linear infinite' }}
          onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {marqueeContent}
        </div>
      </div>

      {/* §01 */}
      <SectionRule num="01" title="The product · three surfaces" />
      <section style={{ padding: '40px 40px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '56px' }}>
          {/* Left */}
          <div>
            <h2 style={{ ...SERIF, fontSize: '64px', lineHeight: 0.95, letterSpacing: '-0.02em', color: '#1a1814', margin: 0 }}>
              Scan. Compare.<br />
              <em style={{ color: '#8b2e2e', fontStyle: 'italic' }}>Concept.</em>
            </h2>
            <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '18px', color: '#6a6258', marginTop: '16px' }}>
              One loop. Every brand you scan teaches the next concept how to land.
            </p>
          </div>

          {/* Right — article rows */}
          <div>
            {[
              { tag: '01 · THE MIRROR', title: 'Scan a brand.', body: 'Drop a URL. We read the site, the about page, and five close competitors. You get a one-page read of how the brand actually shows up — voice, posture, where it leans, where it hides.', cta: 'See a sample scan →', href: '/sample' },
              { tag: '02 · THE BENCH', title: 'Compare to rivals.', body: 'Same prompt, five neighbours. The model returns each one\'s concept profile and ranks them against the brand you scanned. You learn fast where the category is crowded and where it is wide open.', cta: 'Run a head-to-head →', href: '/coming-soon' },
              { tag: '03 · THE LEDE', title: 'Three concepts, ranked.', body: 'Three ad concepts, each scored against the four brain networks. A winner the brain takes home, two it forgets by lunch. You see exactly which seconds carried it and which seconds went dark.', cta: 'Get the three concepts →', href: '/' },
            ].map(({ tag, title, body, cta, href }, i) => (
              <article key={tag} style={{
                display: 'grid', gridTemplateColumns: '110px 1fr 160px', gap: '24px',
                padding: '24px 0',
                borderTop: i === 0 ? '1px solid #1a1814' : '1px solid var(--rule)',
                alignItems: 'start',
              }}>
                <span style={{ ...MONO, color: '#8b2e2e', letterSpacing: '0.20em' }}>{tag}</span>
                <div>
                  <h3 style={{ ...SERIF, fontSize: '32px', lineHeight: 1.05, letterSpacing: '-0.015em', color: '#1a1814', margin: '0 0 8px' }}>{title}</h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#6a6258', lineHeight: 1.55 }}>{body}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <a href={href} style={{ ...MONO, color: '#1a1814', textDecoration: 'underline', letterSpacing: '0.18em' }}>{cta}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section style={{
        background: '#fbf7ee',
        padding: '64px 40px',
        borderTop: '1px solid #1a1814',
        borderBottom: '1px solid #1a1814',
      }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ ...SERIF, fontSize: '200px', fontStyle: 'italic', color: '#8b2e2e', lineHeight: 0.6, height: '60px', overflow: 'hidden', userSelect: 'none' }}>"</div>
          <blockquote style={{ margin: '0' }}>
            <p style={{ ...SERIF, fontSize: '44px', lineHeight: 1.18, letterSpacing: '-0.015em', color: '#1a1814', margin: 0 }}>
              Most ads get scored after they fail.{' '}
              <em style={{ color: '#8b2e2e', fontStyle: 'italic' }}>We score them before.</em>
              {' '}The brain knows in two seconds; we just give you the receipt.
            </p>
          </blockquote>
          <p style={{ ...MONO, color: '#a39c8e', letterSpacing: '0.22em', marginTop: '28px' }}>— Editor&rsquo;s note · the thesis</p>
        </div>
      </section>

      {/* §02 */}
      <div id="how-it-works" />
      <SectionRule num="02" title="How the number is made" />
      <section style={{ padding: '40px 40px 56px' }}>
        <p style={{ ...MONO, color: '#8b2e2e', letterSpacing: '0.20em', marginBottom: '16px' }}>The four-network model</p>
        <h2 style={{ ...SERIF, fontSize: '76px', lineHeight: 0.95, letterSpacing: '-0.02em', color: '#1a1814', margin: '0 0 24px' }}>
          Four networks.<br />
          <em style={{ color: '#8b2e2e', fontStyle: 'italic' }}>One number.</em>
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: '#6a6258', lineHeight: 1.55, maxWidth: '560px', marginBottom: '40px' }}>
          Every score is a weighted blend of four cortical networks that real fMRI data shows decide what we remember and what we share. No vibes. No &ldquo;ad-tech math.&rdquo; Just the brain doing what it does.
        </p>

        {/* 4-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid #1a1814', borderBottom: '1px solid #1a1814' }}>
          {DIMENSIONS.map(({ num, label, pct, quote, body, region }, i) => (
            <div key={label} style={{
              padding: '28px 22px',
              borderRight: i < 3 ? '1px solid var(--rule)' : 'none',
              display: 'flex', flexDirection: 'column', gap: '14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ ...MONO, color: '#a39c8e', fontSize: '14px', letterSpacing: '0.18em' }}>{num}</span>
                <span style={{ ...MONO, color: '#8b2e2e', fontSize: '14px', letterSpacing: '0.18em' }}>weight {pct}</span>
              </div>
              <h3 style={{ ...SERIF, fontSize: '40px', lineHeight: 1, letterSpacing: '-0.02em', color: '#1a1814', margin: 0 }}>{label}</h3>
              <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '16px', color: '#8b2e2e', margin: 0, lineHeight: 1.4 }}>{quote}</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#6a6258', lineHeight: 1.55, margin: 0 }}>{body}</p>
              <span style={{ ...MONO, color: '#a39c8e', letterSpacing: '0.18em', marginTop: 'auto', borderTop: '1px solid var(--rule)', paddingTop: '14px' }}>{region}</span>
            </div>
          ))}
        </div>

        {/* Composite bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '24px' }}>
          <span style={{ ...MONO, color: '#6a6258', letterSpacing: '0.18em', whiteSpace: 'nowrap' }}>Composite weights →</span>
          <div style={{ flex: 1, display: 'flex', height: '6px' }}>
            <div style={{ width: '30%', background: '#8b2e2e' }} />
            <div style={{ width: '25%', background: '#1a1814' }} />
            <div style={{ width: '25%', background: '#6a6258' }} />
            <div style={{ width: '20%', background: '#a39c8e' }} />
          </div>
          <span style={{ ...MONO, color: '#6a6258', letterSpacing: '0.18em', whiteSpace: 'nowrap' }}>Reward · Emotion · Attention · Memory</span>
        </div>
      </section>

      {/* §03 */}
      <SectionRule num="03" title="Built for teams that won't guess" />
      <section style={{ background: '#fbf7ee', padding: '40px 40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '56px', alignItems: 'start' }}>
          {/* Left */}
          <div>
            <h2 style={{ ...SERIF, fontSize: '72px', lineHeight: 0.95, letterSpacing: '-0.02em', color: '#1a1814', margin: 0 }}>
              Ship the ad. Then ship a{' '}
              <em style={{ color: '#8b2e2e', fontStyle: 'italic' }}>better one.</em>
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: '#6a6258', lineHeight: 1.55, maxWidth: '480px', marginTop: '20px' }}>
              The first tool that measured page-speed won the web. The first tool that measures brain-speed wins the feed. Get a sample report in ninety seconds — one run on us, no card.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '24px' }}>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  background: '#1a1814', color: '#fbf7ee', border: 'none',
                  padding: '12px 20px',
                  fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.16em',
                  cursor: 'pointer',
                }}
              >
                Generate concepts →
              </button>
              <a href="/coming-soon" style={{ ...MONO, color: '#1a1814', textDecoration: 'underline', letterSpacing: '0.16em' }}>
                Read the research ↗
              </a>
            </div>
          </div>

          {/* Right — testimonial */}
          <div style={{ borderLeft: '2px solid #8b2e2e', paddingLeft: '24px' }}>
            <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '22px', color: '#1a1814', lineHeight: 1.4, margin: 0 }}>
              &ldquo;We were going to spend $480k testing this in market. Click Spark told us in ninety seconds which one to spend it on. The winner did 2.7× the recall of the runner-up.&rdquo;
            </p>
            <p style={{ ...MONO, color: '#6a6258', letterSpacing: '0.18em', marginTop: '18px' }}>
              — Brand director, outdoor apparel · 12 person team
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#f4efe6', borderTop: '1px solid #1a1814', padding: '32px 40px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 4fr 3fr', gap: '40px' }}>
          {/* Left */}
          <div>
            <div style={{ ...SERIF, fontSize: '28px', color: '#1a1814' }}>
              Click Spark<span style={{ color: '#8b2e2e' }}>.</span>
            </div>
            <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '14px', color: '#6a6258', marginTop: '8px', lineHeight: 1.55 }}>
              Brain-encoded creative. Read before you spend.
            </p>
          </div>

          {/* Middle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <div style={{ ...MONO, color: '#6a6258', letterSpacing: '0.18em', marginBottom: '10px' }}>Product</div>
              {([['Scan', '/'], ['Compare', '/coming-soon'], ['Concepts', '/']] as [string, string][]).map(([l, href]) => (
                <a key={l} href={href} style={{ display: 'block', ...MONO, color: '#6a6258', textDecoration: 'none', marginBottom: '6px', letterSpacing: '0.18em' }}>{l}</a>
              ))}
            </div>
            <div>
              <div style={{ ...MONO, color: '#6a6258', letterSpacing: '0.18em', marginBottom: '10px' }}>Research</div>
              {['The four networks', 'TRIBE v2 paper', 'Methods note'].map(l => (
                <a key={l} href="/coming-soon" style={{ display: 'block', ...MONO, color: '#6a6258', textDecoration: 'none', marginBottom: '6px', letterSpacing: '0.18em' }}>{l}</a>
              ))}
            </div>
          </div>

          {/* Right */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...MONO, color: '#6a6258', letterSpacing: '0.18em', marginBottom: '8px' }}>©2026 Click Spark</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px' }}>
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <a key={l} href="/coming-soon" style={{ ...MONO, color: '#6a6258', textDecoration: 'none', letterSpacing: '0.18em' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
