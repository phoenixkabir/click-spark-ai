import { notFound } from 'next/navigation'
import { decodeConcept } from '@/lib/share'
import { Metadata } from 'next'
import { Suspense } from 'react'
import SharedResultsClient from './SharedResultsClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const concept = decodeConcept(id)
  if (!concept) return { title: 'Score | Click Spark AI' }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clickspark.ai'

  return {
    title: `Brain Score ${concept.overallScore}/100 | Click Spark AI`,
    description: `"${concept.hook}" — Reward ${concept.rewardScore} · Attention ${concept.attentionScore} · Emotion ${concept.emotionScore} · Memory ${concept.memoryScore}`,
    openGraph: {
      title: `${concept.overallScore}/100 brain score`,
      description: `"${concept.hook}"`,
      images: [`${baseUrl}/api/og/${id}`],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${concept.overallScore}/100 brain score`,
      description: `"${concept.hook}"`,
      images: [`${baseUrl}/api/og/${id}`],
    },
  }
}

export default async function SharedResultsPage({ params }: Props) {
  const { id } = await params
  const concept = decodeConcept(id)
  if (!concept) notFound()

  return (
    <Suspense fallback={null}>
      <SharedResultsClient concept={concept} shareId={id} showRescore />
    </Suspense>
  )
}
