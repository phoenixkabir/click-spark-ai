import { NextRequest, NextResponse } from 'next/server'
import { scrapeBrand, scrapeCompetitors } from '@/lib/scraper'
import { buildBrandBrief, generateContentConcepts, discoverCompetitors } from '@/lib/intelligence'
import { scoreConcept } from '@/lib/tribe-client'
import { explainScores } from '@/lib/explainer'
import { getDemoCache } from '@/lib/demo-cache'
import { AnalysisResult, ContentConcept } from '@/lib/types'

function normalizeUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase()
}

export async function POST(req: NextRequest) {
  let url: string
  try {
    const body = await req.json()
    url = body?.url
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  const cached = getDemoCache(normalizeUrl(url))
  if (cached) return NextResponse.json(cached)

  try {
    const brandData = await scrapeBrand(url)
    const competitorUrls = await discoverCompetitors(brandData.content)
    const competitors = await scrapeCompetitors(competitorUrls)
    const competitorContent = competitors.map(c => c.content).join('\n\n---\n\n')
    const brief = await buildBrandBrief(brandData.content, competitorContent)
    const rawConcepts = await generateContentConcepts(brief)

    const scoreResults = await Promise.allSettled(
      rawConcepts.map(async concept => {
        const scores = await scoreConcept({
          text: concept.hook,
          imageDescription: concept.imageDescription,
          videoScript: concept.videoScript,
        })
        const explanations = await explainScores(
          concept.hook,
          concept.imageDescription,
          concept.videoScript,
          scores.rewardScore,
          scores.attentionScore,
          scores.emotionScore,
          scores.memoryScore,
        ).catch(() => undefined)
        const scored: ContentConcept = {
          ...concept,
          rewardScore:    scores.rewardScore,
          attentionScore: scores.attentionScore,
          emotionScore:   scores.emotionScore,
          memoryScore:    scores.memoryScore,
          overallScore:   scores.overallScore,
          explanations,
        }
        return scored
      })
    )

    const scoredConcepts = scoreResults
      .filter((r): r is PromiseFulfilledResult<ContentConcept> => r.status === 'fulfilled')
      .map(r => r.value)

    if (scoredConcepts.length === 0) {
      return NextResponse.json({ error: 'All concepts failed to score' }, { status: 500 })
    }

    const result: AnalysisResult = {
      brand: brief.name,
      url,
      concepts: scoredConcepts,
    }

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
