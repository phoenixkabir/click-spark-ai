export interface TribeScoreRequest {
  text: string
  imageDescription: string
  videoScript: string
}

export interface TribeScoreResponse {
  textScore: number
  visualScore: number
  combinedScore: number
}

export async function scoreConcept(req: TribeScoreRequest): Promise<TribeScoreResponse> {
  const res = await fetch(`${process.env.TRIBE_ENDPOINT_URL}/score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.TRIBE_ENDPOINT_KEY}`,
    },
    body: JSON.stringify({
      text: req.text,
      image_description: req.imageDescription,
      video_script: req.videoScript,
    }),
  })

  if (!res.ok) throw new Error(`TRIBE v2 error: ${res.status}`)

  const data = await res.json()
  return {
    textScore: data.text_score,
    visualScore: data.visual_score,
    combinedScore: data.combined_score,
  }
}
