import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  let body: { brief?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { brief } = body
  if (!brief?.trim()) {
    return NextResponse.json({ error: 'brief required' }, { status: 400 })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.8,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You generate creator-native UGC scripts for brands. Scripts must feel organic — NOT branded, NOT polished, written in the voice of a real creator who happens to love the product.

Each script has:
- persona: a realistic creator handle + niche (e.g. "@dailygrind.co · productivity content")
- platform: TikTok, Instagram Reels, or YouTube Shorts (9:16 format)
- angle: one-word creative angle (social proof, identity play, anti-mainstream, problem-solution, lifestyle)
- hook: the first sentence/line (MUST stop scroll in 2 seconds, read naturally, no corporate language)
- body: 60–90 second script, conversational, creator voice, no sales language
- cta: natural call-to-action that fits the creator persona

Generate 3 distinct scripts with different angles and personas.

Return JSON: { scripts: [ { persona, platform, angle, hook, body, cta, brainScore: null } ] }`,
        },
        {
          role: 'user',
          content: brief,
        },
      ],
    })

    const data = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
