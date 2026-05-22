export interface ContentConcept {
  id: 'a' | 'b' | 'c'
  hook: string
  imageDescription: string
  videoScript: string
  tribeScore: number
  textScore: number
  visualScore: number
}

export interface AnalysisResult {
  brand: string
  url: string
  concepts: ContentConcept[]
  signalsProcessed: number
  percentile: number
}
