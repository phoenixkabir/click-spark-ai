import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { decodeConcept } from '@/lib/share'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const concept = decodeConcept(id)

    if (!concept) {
      return new Response('Invalid share ID', { status: 400 })
    }

    const overallColor = concept.overallScore >= 75 ? '#00d68f' : concept.overallScore >= 50 ? '#f39c12' : '#e74c3c'
    const hook = concept.hook.length > 80 ? concept.hook.slice(0, 78) + '…' : concept.hook

    const dims = [
      { label: 'Reward', score: concept.rewardScore },
      { label: 'Attention', score: concept.attentionScore },
      { label: 'Emotion', score: concept.emotionScore },
      { label: 'Memory', score: concept.memoryScore },
    ]

    return new ImageResponse(
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          padding: '48px 56px',
          fontFamily: 'sans-serif',
          color: '#fff',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 20, height: 2, background: '#00d68f' }} />
          <span style={{ fontSize: 11, color: '#00d68f', fontWeight: 700, letterSpacing: '0.2em' }}>
            BRAIN SCORE
          </span>
        </div>

        {/* Score + hook */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, marginBottom: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <span style={{ fontSize: 80, fontWeight: 900, color: overallColor, lineHeight: 1 }}>
              {concept.overallScore}
            </span>
            <span style={{ fontSize: 13, color: '#555', marginTop: 4 }}>/100 overall</span>
          </div>
          <p style={{ fontSize: 20, fontWeight: 600, color: '#fff', lineHeight: 1.4, margin: 0, paddingTop: 10 }}>
            &ldquo;{hook}&rdquo;
          </p>
        </div>

        {/* Dimension bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
          {dims.map(({ label, score }) => {
            const barColor = score >= 75 ? '#00d68f' : score >= 50 ? '#f39c12' : '#e74c3c'
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ color: '#555', fontSize: 12, width: 68 }}>{label}</span>
                <div style={{ flex: 1, height: 6, background: '#1e1e1e', borderRadius: 3, display: 'flex' }}>
                  <div style={{ width: `${score}%`, height: '100%', background: barColor, borderRadius: 3 }} />
                </div>
                <span style={{ color: barColor, fontWeight: 700, fontSize: 13, width: 24, textAlign: 'right' }}>{score}</span>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid #1e1e1e' }}>
          <span style={{ color: '#333', fontSize: 11 }}>ClipSpark AI</span>
          <span style={{ color: '#333', fontSize: 11 }}>clickspark.ai</span>
        </div>
      </div>,
      { width: 800, height: 420 }
    )
  } catch (err) {
    console.error('[OG] error:', err)
    return new Response('OG generation failed', { status: 500 })
  }
}
