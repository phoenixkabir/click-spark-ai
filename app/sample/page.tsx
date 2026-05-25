const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }

const DIMENSIONS = [
  { label: 'Reward', desc: 'Desire & surprise', score: 94, explanation: 'The phrase "old gear" triggers immediate nostalgia reward — the brain fires before the sentence finishes. It promises a story, not a sale.' },
  { label: 'Attention', desc: 'Visual command', score: 92, explanation: 'Weather-worn equipment against clean copy creates high visual contrast. The eye locks and the edit gives it space to breathe.' },
  { label: 'Emotion', desc: 'Human connection', score: 88, explanation: 'Ownership and memory are deeply personal. The hook activates personal episodic recall, which is one of the strongest emotional anchors.' },
  { label: 'Memory', desc: 'Lasting impression', score: 86, explanation: 'Narrative structures encode deeper than claims. "Has the best stories" leaves a hook the brain finishes on its own — days later.' },
]

export default function SamplePage() {
  const overall = 91
  const scoreColor = '#8b2e2e'

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1a1814', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '6px', textDecoration: 'none' }}>
          <span style={{ color: '#8b2e2e', ...SERIF, fontSize: '18px' }}>◆</span>
          <span style={{ ...SERIF, fontSize: '18px', color: '#1a1814' }}>Click Spark<span style={{ color: '#8b2e2e' }}>.</span></span>
        </a>
        <a href="/" style={{ ...MONO, color: '#a39c8e', textDecoration: 'none', letterSpacing: '0.18em' }}>← Home</a>
      </nav>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '64px 24px' }}>

        {/* Label */}
        <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '8px' }}>Sample report · Patagonia</div>
        <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '40px' }}>What a real scan looks like</div>

        {/* Score */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '16px' }}>Brain Score</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <div style={{ ...SERIF, fontSize: '96px', lineHeight: 0.85, fontVariantNumeric: 'tabular-nums', color: scoreColor }}>
              {overall}
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
            &ldquo;Old gear has the best stories.&rdquo;
          </p>
        </div>

        {/* Dimensions */}
        <div style={{ marginBottom: '40px' }}>
          {DIMENSIONS.map(({ label, desc, score, explanation }) => {
            const c = score >= 75 ? '#8b2e2e' : score >= 50 ? '#6a6258' : '#a39c8e'
            return (
              <div key={label} style={{ borderBottom: '1px solid var(--rule)', padding: '16px 0' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <span style={{ ...MONO, color: 'var(--ink)' }}>{label}</span>
                    <span style={{ ...MONO, color: 'var(--faint)', marginLeft: '8px' }}>{desc}</span>
                  </div>
                  <span style={{ ...SERIF, fontSize: '36px', lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: c }}>{score}</span>
                </div>
                <div style={{ height: '2px', background: 'var(--rule)', marginBottom: '10px' }}>
                  <div style={{ height: '100%', width: `${score}%`, background: c }} />
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--dim)', lineHeight: 1.55, margin: 0 }}>
                  {explanation}
                </p>
              </div>
            )
          })}
        </div>

        {/* Note */}
        <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '32px', marginBottom: '32px' }}>
          <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '12px' }}>About this score</div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--dim)', lineHeight: 1.6 }}>
            This is a real output from Click Spark. Drop any brand URL and get three concepts like this — each scored against 70,000 cortical regions from 720 fMRI subjects. The weights come from peer-reviewed neuroscience, not from engagement metrics or ad platform data.
          </p>
        </div>

        {/* CTA */}
        <a href="/" style={{
          display: 'block',
          background: '#1a1814',
          color: '#fbf7ee',
          padding: '16px 24px',
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          fontWeight: 500,
          textDecoration: 'none',
          letterSpacing: '0.04em',
          textAlign: 'center',
          marginBottom: '16px',
        }}>
          Run a scan on your brand →
        </a>
        <a href="/waitlist" style={{
          display: 'block',
          border: '1px solid var(--rule)',
          color: 'var(--dim)',
          padding: '14px 24px',
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          textDecoration: 'none',
          letterSpacing: '0.04em',
          textAlign: 'center',
        }}>
          Join the waitlist for full access
        </a>

      </div>
    </main>
  )
}
