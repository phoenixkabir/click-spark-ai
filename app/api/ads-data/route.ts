import { NextResponse } from 'next/server'

const TABOOLA_AUTH_URL = 'https://backstage.taboola.com/backstage/oauth/token'
const TABOOLA_API_BASE = 'https://backstage.taboola.com/backstage/api/1.0'

async function getTaboolaToken(): Promise<string> {
  const res = await fetch(TABOOLA_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.TABOOLA_CLIENT_ID!,
      client_secret: process.env.TABOOLA_CLIENT_SECRET!,
      grant_type: 'client_credentials',
    }),
  })
  if (!res.ok) throw new Error(`Taboola auth failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

async function fetchTaboolaCampaigns(token: string, accountId: string) {
  const res = await fetch(`${TABOOLA_API_BASE}/${accountId}/campaigns`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Campaigns fetch failed: ${res.status}`)
  const data = await res.json()
  return (data.results || []) as Array<{
    id: string
    name: string
    status: string
    daily_cap: number
    spent_today?: number
    cpc?: number
    cpm?: number
  }>
}

async function fetchTaboolaPerformance(token: string, accountId: string) {
  const end = new Date().toISOString().split('T')[0]
  const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const res = await fetch(
    `${TABOOLA_API_BASE}/${accountId}/reports/campaign-summary/dimensions/campaign_day_breakdown?start_date=${start}&end_date=${end}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return (data.results || []) as Array<{
    campaign_id: string
    campaign_name: string
    spent: number
    impressions: number
    clicks: number
    conversions_value: number
    roas: number
    date: string
  }>
}

function aggregateByCampaign(rows: ReturnType<typeof fetchTaboolaPerformance> extends Promise<infer T> ? T : never) {
  const map = new Map<string, { id: string; name: string; spent: number; impressions: number; clicks: number; conversions_value: number }>()
  for (const row of rows) {
    const key = row.campaign_id
    const existing = map.get(key)
    if (existing) {
      existing.spent += row.spent || 0
      existing.impressions += row.impressions || 0
      existing.clicks += row.clicks || 0
      existing.conversions_value += row.conversions_value || 0
    } else {
      map.set(key, {
        id: row.campaign_id,
        name: row.campaign_name,
        spent: row.spent || 0,
        impressions: row.impressions || 0,
        clicks: row.clicks || 0,
        conversions_value: row.conversions_value || 0,
      })
    }
  }
  return Array.from(map.values())
}

export async function GET() {
  try {
    const accountId = process.env.TABOOLA_ADVT_ACCOUNT_ID
    if (!accountId || !process.env.TABOOLA_CLIENT_ID) {
      return NextResponse.json({ error: 'Taboola credentials not configured' }, { status: 500 })
    }

    const token = await getTaboolaToken()
    const [campaigns, perfRows] = await Promise.all([
      fetchTaboolaCampaigns(token, accountId),
      fetchTaboolaPerformance(token, accountId),
    ])

    const perfByid = aggregateByCampaign(perfRows as any)
    const perfMap = new Map(perfByid.map(r => [r.id, r]))

    const enriched = campaigns
      .filter(c => c.status !== 'TERMINATED')
      .map(c => {
        const perf = perfMap.get(String(c.id))
        const spent = perf?.spent || 0
        const clicks = perf?.clicks || 0
        const impressions = perf?.impressions || 0
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
        const roas = spent > 0 && perf?.conversions_value ? perf.conversions_value / spent : null

        return {
          id: c.id,
          name: c.name,
          status: c.status,
          spent: Math.round(spent),
          impressions,
          clicks,
          ctr: parseFloat(ctr.toFixed(2)),
          roas: roas ? parseFloat(roas.toFixed(2)) : null,
        }
      })
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 10)

    const totalSpend = enriched.reduce((s, c) => s + c.spent, 0)
    const totalImpressions = enriched.reduce((s, c) => s + c.impressions, 0)
    const totalClicks = enriched.reduce((s, c) => s + c.clicks, 0)
    const avgCtr = totalImpressions > 0 ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0

    return NextResponse.json({
      source: 'taboola',
      accountId,
      campaigns: enriched,
      summary: {
        totalSpend,
        totalImpressions,
        totalClicks,
        avgCtr,
        activeCampaigns: enriched.filter(c => c.status === 'RUNNING').length,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch ads data'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
