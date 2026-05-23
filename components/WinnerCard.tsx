import { ContentConcept } from '@/lib/types'

interface WinnerCardProps {
  concept: ContentConcept
  signalsProcessed: number
  percentile: number
}

export default function WinnerCard({ concept, signalsProcessed, percentile }: WinnerCardProps) {
  return (
    <div className="border border-[#00d68f]/30 rounded-xl bg-[#111] p-6 relative">
      <div className="absolute -top-3 left-5 bg-[#00d68f] text-black text-[10px] font-black px-3 py-1 rounded-full tracking-[0.15em] uppercase">
        Post This
      </div>
      <div className="flex items-start justify-between gap-6 mb-6 mt-2">
        <div className="flex-1">
          <p className="text-white text-xl font-semibold leading-snug">
            &ldquo;{concept.hook}&rdquo;
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-5xl font-black text-[#00d68f] leading-none tabular-nums">
            {concept.tribeScore}
          </div>
          <div className="text-[#00d68f]/60 text-xs font-medium mt-0.5">/100</div>
          <div className="text-[#666] text-[11px] mt-1">brain score</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: 'Text', score: concept.textScore },
          { label: 'Visual', score: concept.visualScore },
          { label: 'Audio', score: Math.round((concept.textScore + concept.visualScore) / 2) },
        ].map(({ label, score }) => (
          <div key={label} className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg p-3 text-center">
            <div className="text-white font-bold text-base tabular-nums">{score}</div>
            <div className="text-[#666] text-[11px] mt-0.5">{label}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-[#222] pt-4">
        <div className="text-[10px] text-[#444] mb-2 uppercase tracking-widest">Video Script</div>
        <p className="text-[#aaa] text-sm leading-relaxed">{concept.videoScript}</p>
      </div>
      <div className="mt-4 text-[11px] text-[#444]">
        Top {percentile}% of content analyzed &middot; {signalsProcessed.toLocaleString()} signals processed
      </div>
    </div>
  )
}
