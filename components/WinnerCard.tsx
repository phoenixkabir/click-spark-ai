import { ContentConcept } from '@/lib/types'

const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }

const SUB_SCORES: { key: keyof Pick<ContentConcept, 'rewardScore' | 'attentionScore' | 'emotionScore'>; label: string }[] = [
  { key: 'rewardScore', label: 'Reward' },
  { key: 'attentionScore', label: 'Attention' },
  { key: 'emotionScore', label: 'Emotion' },
]

export default function WinnerCard({ concept }: { concept: ContentConcept }) {
  return (
    <div style={{ borderTop: '2px solid #1a1814', borderBottom: '1px solid #1a1814', padding: '20px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '24px', alignItems: 'flex-start' }}>

        {/* Left */}
        <div>
          {/* Badge row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{
              ...MONO, background: '#8b2e2e', color: '#fbf7ee',
              padding: '5px 8px', letterSpacing: '0.18em',
            }}>
              Post this
            </span>
            <span style={{ ...MONO, color: '#a39c8e', letterSpacing: '0.18em' }}>Lede · concept 01</span>
          </div>

          {/* Hook */}
          <h2 style={{ ...SERIF, fontSize: '38px', color: '#1a1814', letterSpacing: '-0.015em', lineHeight: 1.1, margin: '0 0 14px' }}>
            &ldquo;{concept.hook}&rdquo;
          </h2>

          {/* Script */}
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#6a6258', lineHeight: 1.55, marginTop: '14px', maxWidth: '540px' }}>
            {concept.videoScript}
          </p>
        </div>

        {/* Right — score */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...MONO, color: '#a39c8e', letterSpacing: '0.18em', marginBottom: '6px' }}>Brain</div>
          <div style={{ ...SERIF, fontSize: '84px', color: '#8b2e2e', lineHeight: 0.85, fontVariantNumeric: 'tabular-nums' }}>
            {concept.overallScore}
          </div>
          <div style={{ ...SERIF, fontStyle: 'italic', fontSize: '12px', color: '#a39c8e', marginTop: '4px' }}>of one hundred</div>
        </div>
      </div>

      {/* Sub-scores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', marginTop: '20px', borderTop: '1px solid var(--rule)', paddingTop: '14px' }}>
        {SUB_SCORES.map(({ key, label }) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <div style={{ ...MONO, color: '#a39c8e', letterSpacing: '0.18em', marginBottom: '6px' }}>{label}</div>
            <div style={{ ...SERIF, fontSize: '32px', color: '#1a1814', fontVariantNumeric: 'tabular-nums' }}>{concept[key]}</div>
          </div>
        ))}
      </div>

      {/* Caption */}
      {concept.explanations && (
        <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '12px', color: '#a39c8e', marginTop: '12px' }}>
          {Object.values(concept.explanations).filter(Boolean)[0]}
        </p>
      )}
    </div>
  )
}
