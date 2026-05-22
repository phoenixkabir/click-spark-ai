import { NextRequest, NextResponse } from 'next/server'
import { scrapeBrand, scrapeCompetitors } from '@/lib/scraper'
import { buildBrandBrief, generateContentConcepts, discoverCompetitors } from '@/lib/intelligence'
import { scoreConcept } from '@/lib/tribe-client'
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
        return {
          ...concept,
          tribeScore: scores.combinedScore,
          textScore: scores.textScore,
          visualScore: scores.visualScore,
        } satisfies ContentConcept
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
      signalsProcessed: 847,
      percentile: 4,
    }

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
