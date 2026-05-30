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

const DUMMY_DATA = {
  source: 'meta',
  accounts: [
    { brand: 'tradewise', accountId: 'demo' },
    { brand: 'astrolearn', accountId: 'demo' },
    { brand: 'healoved', accountId: 'demo' },
  ],
  campaigns: [
    { id: 'tw_001', name: 'Tradewise · Wealth Mindset', brand: 'tradewise', status: 'ACTIVE', objective: 'CONVERSIONS', spend: 48200, impressions: 1840000, clicks: 22100, ctr: 1.20, conversions: 312, roas: 4.8 },
    { id: 'tw_002', name: 'Tradewise · Learn to Invest', brand: 'tradewise', status: 'ACTIVE', objective: 'LEAD_GENERATION', spend: 31500, impressions: 980000, clicks: 14700, ctr: 1.50, conversions: 189, roas: 3.6 },
    { id: 'tw_003', name: 'Tradewise · First Trade', brand: 'tradewise', status: 'PAUSED', objective: 'CONVERSIONS', spend: 12800, impressions: 540000, clicks: 5940, ctr: 1.10, conversions: 67, roas: 2.1 },
    { id: 'al_001', name: 'AstroLearn · Daily Horoscope', brand: 'astrolearn', status: 'ACTIVE', objective: 'APP_INSTALLS', spend: 62400, impressions: 3200000, clicks: 44800, ctr: 1.40, conversions: 2840, roas: 5.2 },
    { id: 'al_002', name: 'AstroLearn · Birth Chart Deep Dive', brand: 'astrolearn', status: 'ACTIVE', objective: 'CONVERSIONS', spend: 29100, impressions: 1120000, clicks: 16800, ctr: 1.50, conversions: 410, roas: 4.1 },
    { id: 'al_003', name: 'AstroLearn · Compatibility Test', brand: 'astrolearn', status: 'ACTIVE', objective: 'TRAFFIC', spend: 18700, impressions: 2400000, clicks: 31200, ctr: 1.30, conversions: 0, roas: null },
    { id: 'al_004', name: 'AstroLearn · Weekly Retargeting', brand: 'astrolearn', status: 'PAUSED', objective: 'CONVERSIONS', spend: 8900, impressions: 310000, clicks: 2790, ctr: 0.90, conversions: 88, roas: 2.8 },
    { id: 'hv_001', name: 'Healoved · Gut Health Protocol', brand: 'healoved', status: 'ACTIVE', objective: 'CONVERSIONS', spend: 54300, impressions: 1650000, clicks: 24750, ctr: 1.50, conversions: 543, roas: 6.1 },
    { id: 'hv_002', name: 'Healoved · Sleep & Recovery', brand: 'healoved', status: 'ACTIVE', objective: 'CONVERSIONS', spend: 38900, impressions: 1240000, clicks: 17360, ctr: 1.40, conversions: 389, roas: 4.7 },
    { id: 'hv_003', name: 'Healoved · Immunity Bundle', brand: 'healoved', status: 'ACTIVE', objective: 'CONVERSIONS', spend: 21600, impressions: 720000, clicks: 8640, ctr: 1.20, conversions: 194, roas: 3.9 },
    { id: 'hv_004', name: 'Healoved · Subscription Launch', brand: 'healoved', status: 'PAUSED', objective: 'CONVERSIONS', spend: 15200, impressions: 480000, clicks: 4320, ctr: 0.90, conversions: 76, roas: 1.8 },
  ],
  summary: {
    totalSpend: 341600,
    totalImpressions: 15478000,
    totalClicks: 193400,
    avgCtr: 1.25,
    activeCampaigns: 8,
  },
  _demo: true,
}

export async function GET() {
  try {
    const token = process.env.FACEBOOK_ACCESS_TOKEN
    if (!token) {
      return NextResponse.json(DUMMY_DATA)
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
