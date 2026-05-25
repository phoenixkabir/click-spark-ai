const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }

const COMING = [
  { num: '01', label: 'Head-to-head compare', body: 'Drop two brand URLs. Get a side-by-side neural profile — see where your category is crowded and where it is wide open.' },
  { num: '02', label: 'Research papers', body: 'The full TRIBE v2 methodology, peer-reviewed weights, and the fMRI study data behind every score.' },
  { num: '03', label: 'Competitor analysis', body: 'Scan up to five competitors in one run. See who owns Reward, who dominates Memory, and where the gap is.' },
  { num: '04', label: 'Team accounts', body: 'Share reports with your agency or brand team. Comment, annotate, and track concepts across campaigns.' },
  { num: '05', label: 'Agency reports', body: 'White-label PDF exports with your branding. Deliver brain-encoded creative briefs directly to clients.' },
]

export default function ComingSoonPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1a1814', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '6px', textDecoration: 'none' }}>
          <span style={{ color: '#8b2e2e', ...SERIF, fontSize: '18px' }}>◆</span>
          <span style={{ ...SERIF, fontSize: '18px', color: '#1a1814' }}>Click Spark<span style={{ color: '#8b2e2e' }}>.</span></span>
        </a>
        <a href="/" style={{ ...MONO, color: '#a39c8e', textDecoration: 'none', letterSpacing: '0.18em' }}>← Back</a>
      </nav>

      {/* Hero */}
      <section style={{ padding: '64px 40px 48px', maxWidth: '800px' }}>
        <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '24px' }}>What's next</div>
        <h1 style={{ ...SERIF, fontSize: '72px', lineHeight: 0.95, letterSpacing: '-0.025em', color: '#1a1814', margin: '0 0 20px' }}>
          Coming soon.<br />
          <em style={{ color: '#8b2e2e' }}>We're building fast.</em>
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: '#6a6258', lineHeight: 1.6, maxWidth: '520px' }}>
          Click Spark is in closed beta. The features below are in active development. Join the waitlist to get early access when they ship.
        </p>
      </section>

      {/* Feature list */}
      <section style={{ padding: '0 40px 64px', maxWidth: '800px' }}>
        {COMING.map(({ num, label, body }, i) => (
          <div key={num} style={{
            display: 'grid',
            gridTemplateColumns: '48px 1fr',
            gap: '24px',
            padding: '28px 0',
            borderTop: i === 0 ? '2px solid #1a1814' : '1px solid var(--rule)',
            alignItems: 'start',
          }}>
            <span style={{ ...SERIF, fontSize: '22px', color: '#a39c8e', lineHeight: 1 }}>{num}</span>
            <div>
              <h3 style={{ ...SERIF, fontSize: '28px', lineHeight: 1.1, letterSpacing: '-0.015em', color: '#1a1814', margin: '0 0 10px' }}>{label}</h3>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#6a6258', lineHeight: 1.6, margin: 0 }}>{body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <div style={{ borderTop: '1px solid #1a1814', padding: '48px 40px', background: '#fbf7ee' }}>
        <div style={{ ...MONO, color: 'var(--faint)', marginBottom: '16px' }}>Get early access</div>
        <h2 style={{ ...SERIF, fontSize: '40px', lineHeight: 1.05, color: '#1a1814', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
          Be first when these ship.
        </h2>
        <a href="/waitlist" style={{
          display: 'inline-block',
          background: '#1a1814',
          color: '#fbf7ee',
          padding: '14px 24px',
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          fontWeight: 500,
          textDecoration: 'none',
          letterSpacing: '0.04em',
        }}>
          Join the waitlist →
        </a>
      </div>

    </main>
  )
}
