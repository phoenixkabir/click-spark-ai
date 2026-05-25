import OpenAI from 'openai'
import { TribeScoreResponse } from './tribe-client'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

// Calibration anchors give GPT a reference frame so single-concept scoring
// matches the same scale as comparative scoring (which GPT does well naturally).
const CALIBRATION = `
Reference calibration (do not score these, just use as scale anchors):
- WEAK (score ~30): Hook: "Bold energy drink" / Visual: "Can on shelf" / Script: "Try it today"
- AVERAGE (score ~55): Hook: "Fuel your day the right way" / Visual: "Person drinking at gym" / Script: "Pre-workout. Post-workout. Anytime."
- STRONG (score ~85): Hook: "You're not drinking water. You're refusing to be boring." / Visual: "Solo person at party, confident, holding Liquid Death while everyone blends in" / Script: "Open on crowded party. Everyone blending in. One person stands out. Text: Refuse to be boring."
`

export async function gptScore(
  text: string,
  imageDescription: string,
  videoScript: string,
  imageBase64?: string,
): Promise<TribeScoreResponse> {
  const prompt = `You are a neuroscience-informed creative scoring engine. Score the target ad concept on 4 brain dimensions, each 0-100.

Dimensions:
- Reward: Surprise, desire, humor, novelty, sensory pleasure — does this trigger wanting?
- Attention: Visual contrast, movement, direct gaze, unexpected change — does this command the eye?
- Emotion: Human connection, belonging, vulnerability, fear, joy — does this create genuine feeling?
- Memory: Memorable phrase, story arc, concrete detail, uniqueness — will this be recalled?
${CALIBRATION}
TARGET (score this):
Hook: "${text}"
Visual: "${imageDescription}"
Script: "${videoScript}"
${imageBase64 ? '\nAn image has been provided — factor it into your Attention and Emotion scores based on what you see.' : ''}
Return ONLY valid JSON with integer scores for the TARGET concept:
{"reward_score":N,"attention_score":N,"emotion_score":N,"memory_score":N}`

  type MessageContent = { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string; detail: 'low' } }
  const userContent: MessageContent[] = [{ type: 'text', text: prompt }]
  if (imageBase64) {
    const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/)
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
    const base64Data = imageBase64.includes(',') ? imageBase64 : `data:${mime};base64,${imageBase64}`
    userContent.push({ type: 'image_url', image_url: { url: base64Data, detail: 'low' } })
  }

  const model = imageBase64 ? 'gpt-4o' : 'gpt-4o-mini'
  const response = await openai.chat.completions.create({
    model,
    max_tokens: 128,
    temperature: 0.1,
    messages: [{ role: 'user', content: userContent }],
  })

  const raw = response.choices[0]?.message?.content ?? ''
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Failed to parse GPT scorer response')
  const parsed = JSON.parse(match[0])

  const r = Math.round(Number(parsed.reward_score))
  const a = Math.round(Number(parsed.attention_score))
  const e = Math.round(Number(parsed.emotion_score))
  const m = Math.round(Number(parsed.memory_score))
  const overall = Math.round(0.30 * r + 0.25 * a + 0.25 * e + 0.20 * m)

  return {
    rewardScore: r,
    attentionScore: a,
    emotionScore: e,
    memoryScore: m,
    overallScore: overall,
  }
}
