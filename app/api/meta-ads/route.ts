import { NextResponse } from 'next/server'

const META_BASE = 'https://graph.facebook.com/v19.0'

interface MetaCampaign {
  id: string
  name: string
  status: string
  objective: string
  daily_budget?: string
  lifetime_budget?: string
}

interface MetaInsightRow {
  campaign_id: string
  campaign_name: string
  spend: string
  impressions: string
  clicks: string
  ctr: string
  actions?: Array<{ action_type: string; value: string }>
  date_start: string
  date_stop: string
}

async function fetchCampaigns(accountId: string, token: string): Promise<MetaCampaign[]> {
  const url = `${META_BASE}/act_${accountId}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget&access_token=${token}&limit=50`
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || `Meta campaigns fetch failed: ${res.status}`)
  }
  const data = await res.json()
  return data.data || []
}

async function fetchInsights(accountId: string, token: string): Promise<MetaInsightRow[]> {
  const url = `${META_BASE}/act_${accountId}/insights?fields=campaign_id,campaign_name,spend,impressions,clicks,ctr,actions&date_preset=last_30d&level=campaign&access_token=${token}&limit=50`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return data.data || []
}

function getConversions(actions?: Array<{ action_type: string; value: string }>): number {
  if (!actions) return 0
  const convTypes = ['purchase', 'lead', 'complete_registration', 'offsite_conversion.fb_pixel_purchase']
  return actions
    .filter(a => convTypes.some(t => a.action_type.includes(t)))
    .reduce((s, a) => s + parseFloat(a.value || '0'), 0)
}

export async function GET() {
  try {
    const token = process.env.FACEBOOK_ACCESS_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'FACEBOOK_ACCESS_TOKEN not configured' }, { status: 500 })
    }

    // Fetch from all configured ad accounts
    const accountEnvs: Record<string, string> = {
      tradewise: process.env.FACEBOOK_MARKETING_TRADEWISE_USER_ID_NEW || process.env.FACEBOOK_MARKETING_TRADEWISE_USER_ID || '',
      astrolearn: process.env.FACEBOOK_MARKETING_ASTROLEARN_USER_ID_NEW || process.env.FACEBOOK_MARKETING_ASTROLEARN_USER_ID || '',
      healoved: process.env.FACEBOOK_MARKETING_HEALOVED_USER_ID || '',
    }

    const results = await Promise.allSettled(
      Object.entries(accountEnvs)
        .filter(([, id]) => id)
        .map(async ([brand, accountId]) => {
          const [campaigns, insights] = await Promise.all([
            fetchCampaigns(accountId, token),
            fetchInsights(accountId, token),
          ])

          const insightMap = new Map(insights.map(r => [r.campaign_id, r]))

          const enriched = campaigns
            .filter(c => c.status !== 'DELETED')
            .map(c => {
              const ins = insightMap.get(c.id)
              const spend = parseFloat(ins?.spend || '0')
              const impressions = parseInt(ins?.impressions || '0', 10)
              const clicks = parseInt(ins?.clicks || '0', 10)
              const ctr = parseFloat(ins?.ctr || '0')
              const conversions = getConversions(ins?.actions)
              const roas = spend > 0 && conversions > 0 ? conversions / spend : null

              return {
                id: c.id,
                name: c.name,
                brand,
                status: c.status,
                objective: c.objective,
                spend: Math.round(spend),
                impressions,
                clicks,
                ctr: parseFloat(ctr.toFixed(2)),
                conversions: Math.round(conversions),
                roas: roas ? parseFloat(roas.toFixed(2)) : null,
              }
            })
            .sort((a, b) => b.spend - a.spend)

          return { brand, accountId, campaigns: enriched }
        })
    )

    const accounts = results
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<Awaited<ReturnType<typeof Promise.resolve>>>).value as { brand: string; accountId: string; campaigns: any[] })

    const allCampaigns = accounts.flatMap(a => a.campaigns)
    const totalSpend = allCampaigns.reduce((s, c) => s + c.spend, 0)
    const totalImpressions = allCampaigns.reduce((s, c) => s + c.impressions, 0)
    const totalClicks = allCampaigns.reduce((s, c) => s + c.clicks, 0)
    const avgCtr = totalImpressions > 0
      ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2))
      : 0
    const activeCampaigns = allCampaigns.filter(c => c.status === 'ACTIVE').length

    return NextResponse.json({
      source: 'meta',
      accounts,
      campaigns: allCampaigns.slice(0, 20),
      summary: { totalSpend, totalImpressions, totalClicks, avgCtr, activeCampaigns },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch Meta Ads data'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
