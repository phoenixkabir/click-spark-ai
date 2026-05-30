import { AnalysisResult } from './types'

const LIQUID_DEATH: AnalysisResult = {
  brand: 'Liquid Death',
  url: 'liquiddeath.com',
  concepts: [
    {
      id: 'a',
      hook: 'Death by hydration',
      imageDescription: 'Skull on a water can against dark background',
      videoScript: "Open on skull. Zoom out. It's a water can. Text: Death by hydration.",
      rewardScore: 52,
      attentionScore: 61,
      emotionScore: 28,
      memoryScore: 45,
      overallScore: 48,
      explanations: {
        reward: 'The skull visual creates a momentary surprise response, but the payoff — it\'s just water — is too expected to sustain curiosity.',
        attention: 'High-contrast dark background and skull imagery pull focus effectively, giving this strong visual command.',
        emotion: 'The concept leans on irony rather than felt experience, leaving little emotional resonance for the viewer to connect with.',
        memory: 'The death-meets-water juxtaposition is distinctive, but the 3-word hook doesn\'t give the brain enough to encode durably.',
      },
    },
    {
      id: 'b',
      hook: "Water that doesn't suck",
      imageDescription: 'Rebellious teenager choosing Liquid Death over generic water bottle',
      videoScript: 'Side by side. Generic water vs Liquid Death. One choice is obvious.',
      rewardScore: 71,
      attentionScore: 68,
      emotionScore: 59,
      memoryScore: 62,
      overallScore: 66,
      explanations: {
        reward: 'The side-by-side comparison triggers a clear desire signal — the brain immediately starts evaluating which to choose.',
        attention: 'The direct comparison format holds focus well, though the visual setup is a familiar advertising pattern.',
        emotion: 'The teen identity angle creates mild belonging signals, but "doesn\'t suck" undersells the emotional opportunity.',
        memory: 'The comparison structure is memorable but the hook is too casual to create a lasting brand imprint.',
      },
    },
    {
      id: 'c',
      hook: "You're not drinking water. You're refusing to be boring.",
      imageDescription: 'Person at party confidently holding Liquid Death, surrounded by people with generic drinks',
      videoScript: "Open on crowded party. Everyone blending in. One person stands out. Liquid Death in hand. Text: Refuse to be boring.",
      rewardScore: 84,
      attentionScore: 79,
      emotionScore: 88,
      memoryScore: 76,
      overallScore: 83,
      explanations: {
        reward: 'Reframing a mundane act as identity-defying behavior activates strong desire and aspiration circuits simultaneously.',
        attention: 'The contrast of one standout figure against a crowd is a proven attention anchor that draws the eye naturally.',
        emotion: 'The belonging-vs-individuality tension hits the anterior cingulate hard — this is the dimension where the concept truly excels.',
        memory: 'The "refuse to be boring" line is a concrete, repeatable phrase the brain can latch onto and recall unprompted.',
      },
    },
  ],
}

const DEMO_DOMAINS = ['liquiddeath.com', 'www.liquiddeath.com']

export function getDemoCache(url: string): AnalysisResult | null {
  const normalized = url.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase()
  const domain = normalized.split('/')[0]
  if (DEMO_DOMAINS.includes(domain)) return LIQUID_DEATH
  return null
}
