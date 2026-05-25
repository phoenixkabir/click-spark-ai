import { ContentConcept } from './types'

// Encodes a concept into a URL-safe base64 string.
// The share URL is self-contained — no server storage needed.
export function encodeConcept(concept: ContentConcept): string {
  const json = JSON.stringify({
    h: concept.hook,
    i: concept.imageDescription,
    v: concept.videoScript,
    r: concept.rewardScore,
    a: concept.attentionScore,
    e: concept.emotionScore,
    m: concept.memoryScore,
    o: concept.overallScore,
    x: concept.explanations,
    s: concept.suggestions,
  })
  return Buffer.from(json).toString('base64url')
}

export function decodeConcept(id: string): ContentConcept | null {
  try {
    const json = Buffer.from(id, 'base64url').toString('utf-8')
    const d = JSON.parse(json)
    return {
      id: 'a',
      hook: d.h,
      imageDescription: d.i,
      videoScript: d.v,
      rewardScore: d.r,
      attentionScore: d.a,
      emotionScore: d.e,
      memoryScore: d.m,
      overallScore: d.o,
      explanations: d.x,
      suggestions: d.s,
    }
  } catch {
    return null
  }
}
