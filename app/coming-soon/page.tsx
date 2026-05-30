'use client'

import { useEffect, useState } from 'react'

const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }
const SANS: React.CSSProperties = { fontFamily: 'var(--font-sans)' }

const FEATURES = [
  {
    num: '01',
    slug: 'compare',
    label: 'Head-to-Head Compare',
    tagline: 'See exactly where competitors own your audience\'s brain.',
    body: 'Drop two brand URLs. Get a side-by-side neural profile — Reward vs Attention vs Emotion vs Memory for each brand. See where your category is crowded and where the white space is.',
    agents: [
      { step: 'Crawl', label: 'Brand Crawler', desc: 'Scrapes 200+ touchpoints per brand — ads, landing pages, video' },
      { step: 'Score', label: 'TRIBE v2 Engine', desc: 'Runs each asset through fMRI-trained neural weights' },
      { step: 'Map', label: 'Gap Analyst', desc: 'Identifies unclaimed neural territory in your category' },
      { step: 'Brief', label: 'Creative Strategist', desc: 'Outputs positioning brief to own the gap' },
    ],
    metric: { value: '4.2×', label: 'avg ROAS lift when brands own unclaimed Reward space' },
  },
  {
    num: '02',
    slug: 'research',
    label: 'Research Papers',
    tagline: 'The science behind every score, peer-reviewed.',
    body: 'Full TRIBE v2 methodology, model weights, and the fMRI study data behind every brain score. 1,200 hours of neural response data from 720 subjects across 20,484 cortical vertices.',
    agents: [
      { step: 'Encode', label: 'Neural Encoder', desc: 'Maps visual/audio/text signals to cortical vertex activations' },
      { step: 'Weight', label: 'V-JEPA2', desc: 'Video-temporal features weighted on 64ms response windows' },
      { step: 'Fuse', label: 'LLaMA Fusion', desc: 'Cross-modal attention aligns all signals to unified score' },
      { step: 'Predict', label: 'ROAS Predictor', desc: 'Maps brain scores to real campaign outcomes' },
    ],
    metric: { value: '91%', label: 'accuracy predicting top-quartile ad performance from score alone' },
  },
  {
    num: '03',
    slug: 'competitor',
    label: 'Competitor Analysis',
    tagline: 'Know before they spend. Win before they launch.',
    body: 'Scan up to five competitors in one run. See who owns Reward, who dominates Memory, and where the gap is. Get a creative brief to outperform each one.',
    agents: [
      { step: 'Detect', label: 'Ad Monitor', desc: 'Tracks competitor ad library changes in real time' },
      { step: 'Score', label: 'TRIBE v2', desc: 'Brain scores every competitor creative automatically' },
      { step: 'Alert', label: 'Gap Sentinel', desc: 'Notifies when a competitor moves into unclaimed space' },
      { step: 'React', label: 'Counter-Brief', desc: 'Generates counter-positioning brief within minutes' },
    ],
    metric: { value: '3.1×', label: 'faster to market with AI-monitored competitive intelligence' },
  },
  {
    num: '04',
    slug: 'team',
    label: 'Team Accounts',
    tagline: 'One brain for the whole team.',
    body: 'Share reports with your agency or brand team. Comment, annotate, and track concepts across campaigns. A shared neural score history that gets smarter with every creative.',
    agents: [
      { step: 'Share', label: 'Report Engine', desc: 'Generates shareable brain score cards with one click' },
      { step: 'Comment', label: 'Annotation Layer', desc: 'Teams annotate scores with campaign context and outcome data' },
      { step: 'Learn', label: 'Outcome Logger', desc: 'Logs real ROAS/CTR against predicted brain scores' },
      { step: 'Train', label: 'Fine-tuner', desc: 'Re-weights TRIBE v2 predictions on your brand\'s outcome data' },
    ],
    metric: { value: '67%', label: 'reduction in creative revision cycles with shared brain scoring' },
  },
  {
    num: '05',
    slug: 'agency',
    label: 'Agency Reports',
    tagline: 'White-label brain scores. Close deals with neuroscience.',
    body: 'White-label PDF exports with your branding. Deliver brain-encoded creative briefs directly to clients. Turn a 30-minute call into a 3-page neural audit that closes.',
    agents: [
      { step: 'Audit', label: 'Creative Auditor', desc: 'Scores the client\'s full ad library overnight' },
      { step: 'Rank', label: 'Performance Ranker', desc: 'Sorts by predicted ROAS, surfaces top 10% and bottom 10%' },
      { step: 'Brief', label: 'Brief Generator', desc: 'Writes creative briefs targeting the top brain score gaps' },
      { step: 'Export', label: 'PDF Builder', desc: 'Branded 3-page report ready to present in the client meeting' },
    ],
    metric: { value: '2.4×', label: 'higher close rate when proposals include neural creative audit' },
  },
]

const GROWTH_STEPS = [
  { month: 'Now', label: 'Score first creative', y: 20 },
  { month: '+30d', label: '50 scores · pattern emerges', y: 32 },
  { month: '+60d', label: '200 scores · model learns your brand', y: 50 },
  { month: '+90d', label: 'Competitor gaps identified', y: 65 },
  { month: '+6mo', label: 'Proprietary dataset · moat building', y: 80 },
  { month: '+1yr', label: 'Unfair advantage · no one can replicate', y: 95 },
]

export default function ComingSoonPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [agentStep, setAgentStep] = useState(0)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setAgentStep(tick % 4)
  }, [tick])

  const feature = FEATURES[activeFeature]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes flow-line { 0%{stroke-dashoffset:100} 100%{stroke-dashoffset:0} }
        @keyframes fade-up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes grow-bar { from{width:0} to{width:var(--bar-w)} }
        .agent-step { animation: fade-up 0.3s ease both; }
        .agent-active { background: rgba(139,46,46,0.06) !important; border-left: 2px solid #8b2e2e !important; }
      `}</style>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid #1a1814',
        padding: '16px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '6px', textDecoration: 'none' }}>
          <span style={{ color: '#8b2e2e', ...SERIF, fontSize: '18px' }}>◆</span>
          <span style={{ ...SERIF, fontSize: '18px', color: '#1a1814' }}>Click Spark<span style={{ color: '#8b2e2e' }}>.</span></span>
        </a>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/score" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none' }}>Score a creative</a>
          <a href="/dashboard" style={{ ...MONO, color: 'var(--dim)', textDecoration: 'none' }}>Dashboard</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '64px 40px 56px', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '16px' }}>What's coming</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: '64px', alignItems: 'end' }}>
          <div>
            <h1 style={{ ...SERIF, fontSize: '72px', lineHeight: 0.95, color: '#1a1814', margin: '0 0 20px' }}>
              The full Distribution OS<br />
              <em style={{ color: '#8b2e2e' }}>ships in waves.</em>
            </h1>
            <p style={{ ...SANS, fontSize: '16px', color: 'var(--dim)', lineHeight: 1.65, maxWidth: '520px', margin: 0 }}>
              Five AI-agent modules. Each one adds a layer to the moat. Together they make your brand's neural data the most valuable asset in your marketing stack.
            </p>
          </div>

          {/* Growth curve */}
          <div style={{ border: '1px solid var(--rule)', background: 'var(--paper)', padding: '24px', borderTop: '2px solid #8b2e2e' }}>
            <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '16px' }}>Compounding advantage over time</div>
            <svg viewBox="0 0 400 140" style={{ width: '100%', height: '140px', overflow: 'visible' }}>
              {/* Grid */}
              {[20, 50, 80, 110].map(y => (
                <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(26,24,20,0.06)" strokeWidth="1" />
              ))}
              {/* Curve */}
              <polyline
                points={GROWTH_STEPS.map((s, i) => `${(i / (GROWTH_STEPS.length - 1)) * 380 + 10},${140 - s.y * 1.3}`).join(' ')}
                fill="none"
                stroke="#8b2e2e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
              {/* Dots */}
              {GROWTH_STEPS.map((s, i) => {
                const x = (i / (GROWTH_STEPS.length - 1)) * 380 + 10
                const y = 140 - s.y * 1.3
                const isLast = i === GROWTH_STEPS.length - 1
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={isLast ? 5 : 3} fill={isLast ? '#8b2e2e' : '#a39c8e'}
                      style={isLast ? { animation: 'pulse-dot 2s ease-in-out infinite' } : {}} />
                    <text x={x} y={y - 10} fill="rgba(26,24,20,0.4)" fontSize="7"
                      textAnchor="middle" fontFamily="var(--font-mono)">{s.month}</text>
                  </g>
                )
              })}
              {/* Shaded area */}
              <polygon
                points={`10,140 ${GROWTH_STEPS.map((s, i) => `${(i / (GROWTH_STEPS.length - 1)) * 380 + 10},${140 - s.y * 1.3}`).join(' ')} 390,140`}
                fill="rgba(139,46,46,0.05)"
              />
            </svg>
            <div style={{ ...MONO, color: '#8b2e2e', marginTop: '8px' }}>Moat deepens with every creative scored</div>
          </div>
        </div>
      </section>

      {/* Features detail */}
      <section style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '600px' }}>

        {/* Sidebar nav */}
        <div style={{ borderRight: '1px solid var(--rule)', padding: '32px 0' }}>
          {FEATURES.map((f, i) => (
            <button
              key={f.slug}
              onClick={() => setActiveFeature(i)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '16px 32px',
                background: activeFeature === i ? 'rgba(139,46,46,0.04)' : 'transparent',
                border: 'none',
                borderLeft: activeFeature === i ? '2px solid #8b2e2e' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              <div style={{ ...MONO, color: activeFeature === i ? '#8b2e2e' : 'var(--faint)', marginBottom: '4px' }}>{f.num}</div>
              <div style={{ ...SANS, fontSize: '13px', color: activeFeature === i ? '#1a1814' : 'var(--dim)', fontWeight: activeFeature === i ? 600 : 400 }}>{f.label}</div>
            </button>
          ))}
        </div>

        {/* Feature detail */}
        <div style={{ padding: '48px' }}>
          <div key={feature.slug} style={{ animation: 'fade-up 0.25s ease both' }}>

            <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '12px' }}>{feature.num} · Coming soon</div>
            <h2 style={{ ...SERIF, fontSize: '48px', lineHeight: 1, color: '#1a1814', margin: '0 0 8px' }}>
              {feature.label}
            </h2>
            <p style={{ ...SANS, fontSize: '18px', color: 'var(--dim)', lineHeight: 1.5, margin: '0 0 24px' }}>
              {feature.tagline}
            </p>
            <p style={{ ...SANS, fontSize: '14px', color: 'var(--dim)', lineHeight: 1.7, margin: '0 0 40px', maxWidth: '520px' }}>
              {feature.body}
            </p>

            {/* AI Agent pipeline */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '16px' }}>AI agent workflow · runs automatically</div>
              <div style={{ display: 'flex', gap: '0', border: '1px solid var(--rule)' }}>
                {feature.agents.map((a, i) => (
                  <div
                    key={a.step}
                    className={`agent-step ${agentStep === i ? 'agent-active' : ''}`}
                    style={{
                      flex: 1,
                      padding: '16px 18px',
                      borderRight: i < feature.agents.length - 1 ? '1px solid var(--rule)' : 'none',
                      background: agentStep === i ? 'rgba(139,46,46,0.04)' : 'var(--paper)',
                      borderLeft: agentStep === i ? '2px solid #8b2e2e' : '2px solid transparent',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: agentStep === i ? '#8b2e2e' : '#a39c8e',
                        display: 'inline-block',
                        ...(agentStep === i ? { animation: 'pulse-dot 1s ease-in-out infinite' } : {}),
                      }} />
                      <span style={{ ...MONO, color: agentStep === i ? '#8b2e2e' : 'var(--faint)', fontSize: '9px' }}>{a.step}</span>
                    </div>
                    <div style={{ ...SANS, fontSize: '12px', color: '#1a1814', fontWeight: 600, marginBottom: '4px' }}>{a.label}</div>
                    <div style={{ ...SANS, fontSize: '11px', color: 'var(--dim)', lineHeight: 1.5 }}>{a.desc}</div>
                  </div>
                ))}
              </div>

              {/* Pipeline arrow connector */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', marginTop: '-1px' }}>
                {feature.agents.map((_, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1, height: '1px', background: agentStep > i ? '#8b2e2e' : 'var(--rule)', transition: 'background 0.4s ease' }} />
                    {i < feature.agents.length - 1 && (
                      <span style={{ ...MONO, fontSize: '8px', color: agentStep > i ? '#8b2e2e' : 'var(--faint)', padding: '0 4px' }}>→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key metric */}
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', padding: '20px 24px', border: '1px solid var(--rule)', background: 'var(--paper)', borderTop: '2px solid #1a1814', maxWidth: '460px' }}>
              <div style={{ ...SERIF, fontSize: '48px', color: '#8b2e2e', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                {feature.metric.value}
              </div>
              <div style={{ ...SANS, fontSize: '13px', color: 'var(--dim)', lineHeight: 1.55 }}>
                {feature.metric.label}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <div style={{ borderTop: '2px solid #1a1814', padding: '64px 40px', background: '#1a1814', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', alignItems: 'center' }}>
        <div>
          <div style={{ ...MONO, color: '#a39c8e', marginBottom: '16px' }}>Early access · limited spots</div>
          <h2 style={{ ...SERIF, fontSize: '48px', lineHeight: 1.05, color: '#fbf7ee', margin: '0 0 12px' }}>
            Be first in line<br />when these ship.
          </h2>
          <p style={{ ...SANS, fontSize: '14px', color: '#a39c8e', lineHeight: 1.6, margin: 0 }}>
            Brands in the first cohort get their neural dataset from day one. That head start compounds — the moat they build in months takes everyone else years to match.
          </p>
        </div>
        <div>
          <a
            href="/waitlist"
            style={{
              display: 'block', width: '100%', boxSizing: 'border-box',
              background: '#8b2e2e', color: '#fbf7ee',
              padding: '16px 24px', textAlign: 'center',
              ...SANS, fontSize: '14px', fontWeight: 600,
              textDecoration: 'none', letterSpacing: '0.04em',
              marginBottom: '12px',
            }}
          >
            Join the waitlist →
          </a>
          <a
            href="/score"
            style={{
              display: 'block', width: '100%', boxSizing: 'border-box',
              background: 'transparent', color: '#a39c8e',
              padding: '14px 24px', textAlign: 'center',
              border: '1px solid rgba(163,156,142,0.3)',
              ...SANS, fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            Score a creative now (it's free)
          </a>
        </div>
      </div>
    </main>
  )
}
