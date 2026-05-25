export interface ContentConcept {
  id: 'a' | 'b' | 'c'
  hook: string
  imageDescription: string
  videoScript: string
  rewardScore: number
  attentionScore: number
  emotionScore: number
  memoryScore: number
  overallScore: number
  explanations?: {
    reward: string
    attention: string
    emotion: string
    memory: string
  }
  suggestions?: {
    improvedHook: string
    improvedScript: string
    why: string
  }
}

export interface AnalysisResult {
  brand: string
  url: string
  concepts: ContentConcept[]
}
