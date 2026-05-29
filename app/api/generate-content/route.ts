import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const PROMPTS: Record<string, string> = {
  linkedin: `You write LinkedIn posts that stop the scroll and get shared.

Rules:
- Open with a bold single-sentence hook (no "I'm excited to share")
- Short punchy paragraphs, 1–3 sentences max
- Use white space aggressively
- Include a concrete insight or counterintuitive take
- Close with a simple question or call to action
- 250–350 words total
- No corporate language, no buzzwords, no em dashes
- Write in first person as a founder/operator who did the thing

Write ONE complete LinkedIn post for the given topic.`,

  youtube: `You write YouTube video scripts for founders and operators.

Format:
- HOOK (first 30 seconds): pattern interrupt, bold claim, or compelling question
- INTRO (30–60 seconds): who this is for, what they'll learn, brief credibility
- MAIN CONTENT: 3–5 structured sections with clear H2 labels, each 2–3 minutes
- OUTRO: summary, call to action, what to watch next

Rules:
- Conversational, spoken English (not written English)
- Specific examples > vague claims
- 8–12 minute video length target
- No filler phrases ("today we're going to", "at the end of the day")
- Include [B-roll notes] or [visual cue] in brackets where helpful

Write ONE complete script for the given topic.`,

  seo: `You write SEO articles that rank and actually get read.

Format:
- Title tag (55–60 chars, includes target keyword)
- Meta description (150 chars)
- H1 (same or close to title tag)
- Introduction (100 words, hook + what the article covers)
- 4–6 H2 sections with 120–180 words each
- Conclusion with CTA (80 words)

Rules:
- Target keyword appears naturally in first 100 words, H1, and 2–3 H2s
- Specific data points and examples where possible
- No keyword stuffing, no AI-sounding phrases
- Written for a human who is actually trying to make a decision
- 800–1000 words total

Write ONE complete article for the given topic.`,
}

export async function POST(req: NextRequest) {
  let body: { brief?: string; type?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { brief, type } = body
  if (!brief?.trim()) return NextResponse.json({ error: 'brief required' }, { status: 400 })
  if (!type || !PROMPTS[type]) return NextResponse.json({ error: 'type must be linkedin, youtube, or seo' }, { status: 400 })

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [
        { role: 'system', content: PROMPTS[type] },
        { role: 'user', content: brief },
      ],
    })

    const content = completion.choices[0].message.content || ''
    return NextResponse.json({ content, type })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
