import { ContentConcept } from '@/lib/types'

const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.18em' }

export default function LoserCard({ concept, index }: { concept: ContentConcept; index: number }) {
  const orderNum = String(index + 2).padStart(2, '0')
  const scoreColor = concept.overallScore >= 60 ? '#1a1814' : '#a39c8e'

  return (
    <div style={{
      borderBottom: '1px solid var(--rule)',
      padding: '14px 0',
      display: 'grid',
      gridTemplateColumns: '40px 1fr 80px',
      alignItems: 'baseline',
      gap: '18px',
    }}>
      <span style={{ ...SERIF, fontSize: '22px', color: '#a39c8e' }}>{orderNum}</span>
      <div>
        <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '19px', color: '#6a6258', margin: 0 }}>
          &ldquo;{concept.hook}&rdquo;
        </p>
        {concept.explanations && (
          <p style={{ ...MONO, color: '#a39c8e', letterSpacing: '0.18em', marginTop: '6px' }}>
            {Object.values(concept.explanations).filter(Boolean)[0]}
          </p>
        )}
      </div>
      <span style={{ ...SERIF, fontSize: '44px', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums', color: scoreColor, textAlign: 'right' }}>
        {concept.overallScore}
      </span>
    </div>
  )
}
