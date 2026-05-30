import OpenAI from 'openai'
import { ContentConcept } from './types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export interface BrandBrief {
  name: string
  tone: string
  audience: string
  differentiator: string
  competitorGaps: string
}

function extractJSON<T>(text: string, arrayMode = false): T {
  const pattern = arrayMode ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/
  const match = text.match(pattern)
  if (!match) throw new Error('Failed to parse JSON from OpenAI response')
  return JSON.parse(match[0]) as T
}

export async function discoverCompetitors(brandContent: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 256,
    messages: [{
      role: 'user',
      content: `Based on this brand content, name the top 3 competitor domains. Return ONLY a JSON array: ["domain1.com","domain2.com","domain3.com"]\n\n${brandContent.slice(0, 2000)}`
    }]
  })
  const text = response.choices[0]?.message?.content ?? '[]'
  return extractJSON<string[]>(text, true)
}

export async function buildBrandBrief(
  brandContent: string,
  competitorContent: string
): Promise<BrandBrief> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Analyze this brand and its competitors. Return ONLY valid JSON:
{"name":"Brand name","tone":"2-3 word voice","audience":"one sentence","differentiator":"what makes brand unique","competitorGaps":"what competitors are not doing"}

BRAND:\n${brandContent}\n\nCOMPETITORS:\n${competitorContent.slice(0, 8000)}`
    }]
  })
  const text = response.choices[0]?.message?.content ?? ''
  return extractJSON<BrandBrief>(text)
}

export async function generateContentConcepts(
  brief: BrandBrief
): Promise<Omit<ContentConcept, 'rewardScore' | 'attentionScore' | 'emotionScore' | 'memoryScore' | 'overallScore'>[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Generate 3 DISTINCTLY DIFFERENT content concepts for this brand. Each concept must use a completely different psychological mechanism — the brain engagement scores should diverge significantly when tested.

Brand: ${brief.name}
Tone: ${brief.tone}
Audience: ${brief.audience}
Differentiator: ${brief.differentiator}
Competitor gaps: ${brief.competitorGaps}

Concept A: shock/provocation angle
Concept B: identity/belonging angle
Concept C: movement/transformation angle

Return ONLY valid JSON array:
[{"id":"a","hook":"opening line max 15 words","imageDescription":"detailed visual description","videoScript":"15-second video angle 2-3 sentences"},{"id":"b",...},{"id":"c",...}]`
    }]
  })
  const text = response.choices[0]?.message?.content ?? ''
  return extractJSON<Omit<ContentConcept, 'rewardScore' | 'attentionScore' | 'emotionScore' | 'memoryScore' | 'overallScore'>[]>(text, true)
}
