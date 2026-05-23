import { ContentConcept } from '@/lib/types'

export default function LoserCard({ concept }: { concept: ContentConcept }) {
  const color = concept.tribeScore < 55 ? 'text-[#e74c3c]' : 'text-[#f39c12]'

  return (
    <div className="border border-[#1e1e1e] rounded-lg bg-[#0d0d0d] px-4 py-3.5 flex items-center justify-between gap-4">
      <p className="text-[#777] text-sm flex-1 leading-snug">&ldquo;{concept.hook}&rdquo;</p>
      <div className="text-right flex-shrink-0">
        <div className={`text-xl font-black tabular-nums ${color}`}>{concept.tribeScore}</div>
        <div className="text-[#444] text-[10px]">/100</div>
      </div>
    </div>
  )
}
