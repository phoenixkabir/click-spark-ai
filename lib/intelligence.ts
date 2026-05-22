import Anthropic from '@anthropic-ai/sdk'
import { ContentConcept } from './types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

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
  if (!match) throw new Error('Failed to parse JSON from Claude response')
  return JSON.parse(match[0]) as T
}

export async function discoverCompetitors(brandContent: string): Promise<string[]> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [{
      role: 'user',
      content: `Based on this brand content, name the top 3 competitor domains. Return ONLY a JSON array: ["domain1.com","domain2.com","domain3.com"]\n\n${brandContent.slice(0, 2000)}`
    }]
  })
  const text = msg.content[0].type === 'text' ? msg.content[0].text : '[]'
  return extractJSON<string[]>(text, true)
}

export async function buildBrandBrief(
  brandContent: string,
  competitorContent: string
): Promise<BrandBrief> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Analyze this brand and its competitors. Return ONLY valid JSON:
{"name":"Brand name","tone":"2-3 word voice","audience":"one sentence","differentiator":"what makes brand unique","competitorGaps":"what competitors are not doing"}

BRAND:\n${brandContent}\n\nCOMPETITORS:\n${competitorContent.slice(0, 8000)}`
    }]
  })
  const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
  return extractJSON<BrandBrief>(text)
}

export async function generateContentConcepts(
  brief: BrandBrief
): Promise<Omit<ContentConcept, 'tribeScore' | 'textScore' | 'visualScore'>[]> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Generate 3 DISTINCTLY DIFFERENT content concepts for this brand. Use completely different psychological hooks so brain engagement scores will diverge significantly.

Brand: ${brief.name}
Tone: ${brief.tone}
Audience: ${brief.audience}
Differentiator: ${brief.differentiator}
Competitor gaps: ${brief.competitorGaps}

Concept A: shock/provocation angle (intentionally low brain engagement)
Concept B: identity/belonging angle (mid brain engagement)
Concept C: movement/transformation angle (highest brain engagement — this is the winner)

Return ONLY valid JSON array:
[{"id":"a","hook":"opening line max 15 words","imageDescription":"detailed visual description","videoScript":"15-second video angle 2-3 sentences"},{"id":"b",...},{"id":"c",...}]`
    }]
  })
  const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
  return extractJSON<Omit<ContentConcept, 'tribeScore' | 'textScore' | 'visualScore'>[]>(text, true)
}
