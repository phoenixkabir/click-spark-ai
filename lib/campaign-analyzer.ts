import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export interface CampaignInput {
  id: string
  name: string
  platform: string
  status: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  roas: number | null
}

export interface CampaignGrade {
  id: string
  name: string
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  score: number
  verdict: string
  topIssue: string
  recommendation: string
}

export interface AnalysisResult {
  summary: string
  portfolioGrade: string
  campaigns: CampaignGrade[]
  priorities: Array<{ action: string; impact: 'high' | 'medium' | 'low'; why: string }>
  alerts: Array<{ type: 'critical' | 'warning' | 'good'; message: string }>
}

export async function analyzeCampaignPerformance(
  campaigns: CampaignInput[],
  opts?: { targetRoas?: number; targetCpa?: number; currency?: string }
): Promise<AnalysisResult> {
  const { targetRoas = 3, currency = '₹' } = opts || {}

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0)
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0)
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0)
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

  const prompt = `You are a senior performance marketing analyst. Analyze these ad campaigns and return ONLY valid JSON.

CAMPAIGNS (${campaigns.length} total):
${JSON.stringify(campaigns, null, 2)}

PORTFOLIO TOTALS: spend=${currency}${totalSpend}, impressions=${totalImpressions}, clicks=${totalClicks}, avg_ctr=${avgCtr.toFixed(2)}%
TARGET ROAS: ${targetRoas}x
CURRENCY: ${currency}

Grade each campaign A-F using weighted criteria:
- Efficiency (30%): spend-to-results conversion vs peers
- Engagement (25%): CTR quality (industry benchmarks: native/Taboola ~0.1-0.5%, Meta ~1-3%, Google Search ~5-10%)
- Reach (20%): impression volume relative to spend
- Consistency (15%): active/enabled status (PAUSED/REJECTED campaigns score lower)
- Potential (10%): growth runway based on performance signals

Return this exact JSON structure (no markdown, no extra text):
{
  "summary": "2-3 sentence plain English portfolio verdict",
  "portfolioGrade": "A|B|C|D|F",
  "campaigns": [
    {
      "id": "campaign_id",
      "name": "campaign name",
      "grade": "A|B|C|D|F",
      "score": 0-100,
      "verdict": "one sentence assessment",
      "topIssue": "main problem or 'None — performing well'",
      "recommendation": "single most impactful next action"
    }
  ],
  "priorities": [
    { "action": "specific action", "impact": "high|medium|low", "why": "one sentence reason" }
  ],
  "alerts": [
    { "type": "critical|warning|good", "message": "specific alert message" }
  ]
}`

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })

  const raw = res.choices[0].message.content || '{}'
  return JSON.parse(raw) as AnalysisResult
}
