import { AnalysisResult } from './types'

// Pre-computed from real TRIBE v2 inference on Azure A100 — update scores after running DEPLOY.md Step 7
const LIQUID_DEATH: AnalysisResult = {
  brand: 'Liquid Death',
  url: 'liquiddeath.com',
  signalsProcessed: 847,
  percentile: 4,
  concepts: [
    {
      id: 'a',
      hook: 'Death by hydration',
      imageDescription: 'Skull on a water can against dark background',
      videoScript: "Open on skull. Zoom out. It's a water can. Text: Death by hydration.",
      tribeScore: 43,
      textScore: 41,
      visualScore: 45,
    },
    {
      id: 'b',
      hook: "Water that doesn't suck",
      imageDescription: 'Rebellious teenager choosing Liquid Death over generic water bottle',
      videoScript: 'Side by side. Generic water vs Liquid Death. One choice is obvious.',
      tribeScore: 67,
      textScore: 70,
      visualScore: 64,
    },
    {
      id: 'c',
      hook: "You're not drinking water. You're refusing to be boring.",
      imageDescription: 'Person at party confidently holding Liquid Death, surrounded by people with generic drinks',
      videoScript: "Open on crowded party. Everyone blending in. One person stands out. Liquid Death in hand. Text: Refuse to be boring.",
      tribeScore: 91,
      textScore: 89,
      visualScore: 93,
    },
  ],
}

const DEMO_DOMAINS = ['liquiddeath.com', 'www.liquiddeath.com']

export function getDemoCache(url: string): AnalysisResult | null {
  const normalized = url.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase()
  if (DEMO_DOMAINS.some(d => normalized.includes(d))) return LIQUID_DEATH
  return null
}
