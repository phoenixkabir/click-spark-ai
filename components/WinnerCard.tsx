import { ContentConcept } from '@/lib/types'

interface WinnerCardProps {
  concept: ContentConcept
  signalsProcessed: number
  percentile: number
}

export default function WinnerCard({ concept, signalsProcessed, percentile }: WinnerCardProps) {
  return (
    <div className="border-2 border-[#00d68f] rounded-2xl bg-[#0d1f1a] p-6 relative">
      <div className="absolute -top-3 left-6 bg-[#00d68f] text-black text-xs font-black px-3 py-1 rounded-full tracking-widest uppercase">
        Post This
      </div>
      <div className="flex items-start justify-between mb-6 mt-2">
        <div className="flex-1 pr-6">
          <div className="text-xs text-[#00d68f] font-semibold tracking-widest uppercase mb-2">
            Top Concept
          </div>
          <p className="text-white text-lg font-semibold leading-snug">
            "{concept.hook}"
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-6xl font-black text-[#00d68f] leading-none">
            {concept.tribeScore}
          </div>
          <div className="text-[#00d68f] text-sm font-medium">/100</div>
          <div className="text-[#555] text-xs mt-1">brain score</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Text', score: concept.textScore },
          { label: 'Visual', score: concept.visualScore },
          { label: 'Audio', score: Math.round((concept.textScore + concept.visualScore) / 2) },
        ].map(({ label, score }) => (
          <div key={label} className="bg-[#0a1a12] rounded-lg p-3 text-center">
            <div className="text-[#00d68f] font-bold text-sm">{score}</div>
            <div className="text-[#555] text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-[#1a3328] pt-4">
        <div className="text-xs text-[#555] mb-2 uppercase tracking-wider">Video Script</div>
        <p className="text-[#888] text-sm leading-relaxed">{concept.videoScript}</p>
      </div>
      <div className="mt-4 text-xs text-[#444]">
        Top {percentile}% of content analyzed · {signalsProcessed.toLocaleString()} signals processed
      </div>
    </div>
  )
}
