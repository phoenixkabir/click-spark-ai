import { NextRequest, NextResponse } from 'next/server'
import { scoreConcept } from '@/lib/tribe-client'
import { explainScores } from '@/lib/explainer'
import { parseCreative } from '@/lib/creative-parser'
import { generateSuggestions } from '@/lib/suggester'
import { encodeConcept } from '@/lib/share'
import { ContentConcept } from '@/lib/types'

export async function POST(req: NextRequest) {
  let body: {
    creative?: string
    imageBase64?: string
    videoUrl?: string
    // legacy fields still accepted
    hook?: string
    imageDescription?: string
    videoScript?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    let hook: string
    let imageDescription: string
    let videoScript: string

    if (body.creative?.trim()) {
      // New single-block path: parse the raw creative
      const parsed = await parseCreative(body.creative.trim())
      hook = parsed.hook
      imageDescription = parsed.imageDescription
      videoScript = parsed.videoScript
    } else if (body.hook?.trim()) {
      // Legacy three-field path
      hook = body.hook.trim()
      imageDescription = body.imageDescription ?? ''
      videoScript = body.videoScript ?? ''
    } else {
      return NextResponse.json({ error: 'creative or hook required' }, { status: 400 })
    }

    if (body.videoUrl?.trim()) {
      imageDescription = imageDescription
        ? `${imageDescription}\nVideo reference: ${body.videoUrl.trim()}`
        : `Video reference: ${body.videoUrl.trim()}`
    }

    const [scores, explanations, suggestions] = await Promise.allSettled([
      scoreConcept({ text: hook, imageDescription, videoScript, imageBase64: body.imageBase64 }),
      explainScores(hook, imageDescription, videoScript, 0, 0, 0, 0).catch(() => undefined),
      Promise.resolve(undefined),
    ])

    const scoreData = scores.status === 'fulfilled' ? scores.value : null
    if (!scoreData) throw new Error('Scoring failed')

    // Now fetch explanations and suggestions in parallel with actual scores
    const [explResult, suggResult] = await Promise.allSettled([
      explainScores(
        hook, imageDescription, videoScript,
        scoreData.rewardScore, scoreData.attentionScore,
        scoreData.emotionScore, scoreData.memoryScore,
      ),
      generateSuggestions(
        hook, imageDescription, videoScript,
        scoreData.rewardScore, scoreData.attentionScore,
        scoreData.emotionScore, scoreData.memoryScore,
      ),
    ])

    const concept: ContentConcept = {
      id: 'a',
      hook,
      imageDescription,
      videoScript,
      ...scoreData,
      explanations: explResult.status === 'fulfilled' ? explResult.value : undefined,
      suggestions: suggResult.status === 'fulfilled' ? suggResult.value : undefined,
    }

    const shareId = encodeConcept(concept)
    return NextResponse.json({ ...concept, shareId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Scoring failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
