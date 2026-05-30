import { NextRequest, NextResponse } from 'next/server'
import { analyzeCampaignPerformance, type CampaignInput } from '@/lib/campaign-analyzer'

export async function POST(req: NextRequest) {
  try {
    const { campaigns, targetRoas, currency } = await req.json()
    if (!campaigns?.length) {
      return NextResponse.json({ error: 'campaigns array is required' }, { status: 400 })
    }
    const result = await analyzeCampaignPerformance(campaigns as CampaignInput[], { targetRoas, currency })
    return NextResponse.json({ analysis: result })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Analysis failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
