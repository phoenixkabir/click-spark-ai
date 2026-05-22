import FirecrawlApp from '@mendable/firecrawl-js'

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! })

export interface BrandData {
  url: string
  content: string
}

export interface CompetitorData {
  url: string
  content: string
}

export async function scrapeBrand(url: string): Promise<BrandData> {
  const normalized = url.startsWith('http') ? url : `https://${url}`
  const result = await firecrawl.scrapeUrl(normalized, {
    formats: ['markdown'],
    onlyMainContent: true,
  })
  if (!result.success || !result.markdown) {
    throw new Error(`Failed to scrape ${url}`)
  }
  return { url: normalized, content: result.markdown.slice(0, 8000) }
}

export async function scrapeCompetitors(urls: string[]): Promise<CompetitorData[]> {
  const results = await Promise.allSettled(
    urls.slice(0, 3).map(async url => {
      const normalized = url.startsWith('http') ? url : `https://${url}`
      const result = await firecrawl.scrapeUrl(normalized, {
        formats: ['markdown'],
        onlyMainContent: true,
      })
      if (!result.success || !result.markdown) return null
      return { url: normalized, content: result.markdown.slice(0, 4000) }
    })
  )
  return results
    .filter((r): r is PromiseFulfilledResult<CompetitorData> =>
      r.status === 'fulfilled' && r.value !== null
    )
    .map(r => r.value)
}
