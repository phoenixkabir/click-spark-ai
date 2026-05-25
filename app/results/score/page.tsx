'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ContentConcept } from '@/lib/types'
import SharedResultsClient from '../[id]/SharedResultsClient'

export default function ScoreResultsPage() {
  const router = useRouter()
  const [concept, setConcept] = useState<ContentConcept | null>(null)
  const [shareId, setShareId] = useState<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('scoredConcept')
    const storedShareId = sessionStorage.getItem('scoredConceptShareId')
    if (!stored) { router.push('/score'); return }
    try {
      setConcept(JSON.parse(stored) as ContentConcept)
      setShareId(storedShareId)
    } catch {
      router.push('/score')
    }
  }, [router])

  if (!concept || !shareId) return null

  return <SharedResultsClient concept={concept} shareId={shareId} showRescore />
}
