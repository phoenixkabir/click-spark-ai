import { NextRequest, NextResponse } from 'next/server'
import { scoreConcept } from '@/lib/tribe-client'

export async function POST(req: NextRequest) {
  const { text, imageDescription, videoScript } = await req.json()
  if (!text) return NextResponse.json({ error: 'text required' }, { status: 400 })

  try {
    const scores = await scoreConcept({ text, imageDescription: imageDescription || '', videoScript: videoScript || '' })
    return NextResponse.json(scores)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Scoring failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
