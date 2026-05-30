import { NextRequest, NextResponse } from 'next/server'

const TABOOLA_API_BASE = 'https://backstage.taboola.com/backstage/api/1.0'

async function getTaboolaToken(): Promise<string> {
  const res = await fetch('https://backstage.taboola.com/backstage/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.TABOOLA_CLIENT_ID!,
      client_secret: process.env.TABOOLA_CLIENT_SECRET!,
      grant_type: 'client_credentials',
    }),
  })
  if (!res.ok) throw new Error(`Taboola auth failed: ${res.status}`)
  return (await res.json()).access_token
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params
    const { status } = await req.json()
    const validStatuses = ['RUNNING', 'PAUSED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `status must be one of: ${validStatuses.join(', ')}` }, { status: 400 })
    }

    const accountId = process.env.TABOOLA_ADVT_ACCOUNT_ID
    if (!accountId || !process.env.TABOOLA_CLIENT_ID) {
      return NextResponse.json({ error: 'Taboola credentials not configured' }, { status: 500 })
    }

    const token = await getTaboolaToken()
    const res = await fetch(`${TABOOLA_API_BASE}/${accountId}/campaigns/${campaignId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: status === 'RUNNING' }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Taboola campaign update failed: ${res.status} — ${err}`)
    }

    const updated = await res.json()
    return NextResponse.json({ success: true, campaign: updated })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update campaign status'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
