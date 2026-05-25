import { gptScore } from './gpt-scorer'

export interface TribeScoreRequest {
  text: string
  imageDescription: string
  videoScript: string
  imageBase64?: string
}

export interface TribeScoreResponse {
  rewardScore: number
  attentionScore: number
  emotionScore: number
  memoryScore: number
  overallScore: number
}

export async function scoreConcept(req: TribeScoreRequest): Promise<TribeScoreResponse> {
  return gptScore(req.text, req.imageDescription, req.videoScript, req.imageBase64)
}
