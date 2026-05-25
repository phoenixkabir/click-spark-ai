import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export interface ParsedCreative {
  hook: string
  imageDescription: string
  videoScript: string
}

export async function parseCreative(raw: string): Promise<ParsedCreative> {
  const prompt = `You are a creative director parsing an ad concept. Extract the three components below from the input.
If a component isn't explicitly present, infer it from context.

Input:
"""
${raw}
"""

Return ONLY valid JSON:
{
  "hook": "the opening line or headline (1-2 sentences max)",
  "imageDescription": "what's visually in the shot / scene description",
  "videoScript": "the full script or narration"
}

If the entire input looks like a single hook/tagline with no visual or script, put it in hook and leave the others as empty strings.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 512,
    temperature: 0.1,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.choices[0]?.message?.content ?? ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Failed to parse creative')
  const parsed = JSON.parse(match[0])
  return {
    hook: parsed.hook ?? raw,
    imageDescription: parsed.imageDescription ?? '',
    videoScript: parsed.videoScript ?? '',
  }
}
