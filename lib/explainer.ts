import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export interface DimensionExplanations {
  reward: string
  attention: string
  emotion: string
  memory: string
}

const DIMENSION_CONTEXT: Record<string, string> = {
  reward: 'Reward (orbitofrontal cortex) — does this trigger desire, surprise, or excitement?',
  attention: 'Attention (frontal/parietal cortex) — does this visually or dynamically demand focus?',
  emotion: 'Emotion (insula/anterior cingulate) — does this create human connection or feeling?',
  memory: 'Memory (parahippocampal cortex) — does this create a lasting, distinctive impression?',
}

function scoreLabel(score: number): string {
  if (score >= 75) return 'strong'
  if (score >= 50) return 'moderate'
  if (score >= 25) return 'weak'
  return 'very weak'
}

export async function explainScores(
  hook: string,
  imageDescription: string,
  videoScript: string,
  rewardScore: number,
  attentionScore: number,
  emotionScore: number,
  memoryScore: number,
): Promise<DimensionExplanations> {
  const prompt = `You are a neuroscience-informed creative strategist. Explain why each brain dimension scored the way it did for this ad concept. Be specific about what in the creative is driving the score — one punchy sentence per dimension, no fluff.

Creative:
Hook: "${hook}"
Visual: "${imageDescription}"
Script: "${videoScript}"

Scores (0–100):
- Reward: ${rewardScore}/100 (${scoreLabel(rewardScore)}) — ${DIMENSION_CONTEXT.reward}
- Attention: ${attentionScore}/100 (${scoreLabel(attentionScore)}) — ${DIMENSION_CONTEXT.attention}
- Emotion: ${emotionScore}/100 (${scoreLabel(emotionScore)}) — ${DIMENSION_CONTEXT.emotion}
- Memory: ${memoryScore}/100 (${scoreLabel(memoryScore)}) — ${DIMENSION_CONTEXT.memory}

Return ONLY valid JSON:
{"reward":"one sentence","attention":"one sentence","emotion":"one sentence","memory":"one sentence"}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 512,
    temperature: 0.4,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.choices[0]?.message?.content ?? ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Failed to parse explainer response')
  return JSON.parse(match[0]) as DimensionExplanations
}
