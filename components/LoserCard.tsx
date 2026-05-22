import { ContentConcept } from '@/lib/types'

export default function LoserCard({ concept }: { concept: ContentConcept }) {
  const color = concept.tribeScore < 55 ? 'text-[#e74c3c]' : 'text-[#f39c12]'

  return (
    <div className="border border-[#222] rounded-xl bg-[#141414] p-4 flex items-center justify-between gap-4">
      <p className="text-[#555] text-sm flex-1 leading-snug">"{concept.hook}"</p>
      <div className="text-right flex-shrink-0">
        <div className={`text-2xl font-black ${color}`}>{concept.tribeScore}</div>
        <div className="text-[#444] text-xs">/100</div>
      </div>
    </div>
  )
}
