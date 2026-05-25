import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export interface Suggestions {
  improvedHook: string
  improvedScript: string
  why: string
}

export async function generateSuggestions(
  hook: string,
  imageDescription: string,
  videoScript: string,
  rewardScore: number,
  attentionScore: number,
  emotionScore: number,
  memoryScore: number,
): Promise<Suggestions> {
  const weakest = [
    { dim: 'Reward', score: rewardScore },
    { dim: 'Attention', score: attentionScore },
    { dim: 'Emotion', score: emotionScore },
    { dim: 'Memory', score: memoryScore },
  ].sort((a, b) => a.score - b.score).slice(0, 2).map(d => d.dim).join(' and ')

  const prompt = `You are a world-class neuroscience-informed creative director. You scored this ad concept:

Hook: "${hook}"
Visual: "${imageDescription}"
Script: "${videoScript}"

Scores: Reward ${rewardScore}/100, Attention ${attentionScore}/100, Emotion ${emotionScore}/100, Memory ${memoryScore}/100

The weakest dimensions are: ${weakest}. Rewrite the hook and script to score significantly higher on these dimensions, without losing the brand's voice. Be specific and punchy — not generic. The improved hook should be a single line that could stop a scroll.

Return ONLY valid JSON:
{
  "improvedHook": "rewritten opening line that would score higher on ${weakest}",
  "improvedScript": "rewritten 15-second script (2-4 sentences)",
  "why": "one punchy sentence explaining the key change and why it hits harder neurologically"
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 512,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.choices[0]?.message?.content ?? ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Failed to parse suggestions')
  return JSON.parse(match[0]) as Suggestions
}
