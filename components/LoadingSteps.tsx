'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  'Scanning brand website...',
  'Identifying top 3 competitors...',
  'Processing audience signals...',
  'Generating content concepts...',
  'Running TRIBE v2 brain encoding...',
]

interface LoadingStepsProps {
  onComplete: () => void
  analysisComplete: boolean
}

export default function LoadingSteps({ onComplete, analysisComplete }: LoadingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    if (currentStep >= STEPS.length - 1) return

    const timer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, currentStep])
      setCurrentStep(prev => prev + 1)
    }, 1400)

    return () => clearTimeout(timer)
  }, [currentStep])

  useEffect(() => {
    if (analysisComplete && currentStep === STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, STEPS.length - 1])
        setTimeout(onComplete, 400)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [analysisComplete, currentStep, onComplete])

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {STEPS.map((step, i) => {
        const done = completedSteps.includes(i)
        const active = i === currentStep && !done

        return (
          <div
            key={i}
            className={`flex items-center gap-3 transition-all duration-500 ${
              i > currentStep && !done ? 'opacity-20' : 'opacity-100'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-300 ${
              done
                ? 'bg-[#00d68f] text-black'
                : active
                ? 'border-2 border-[#00d68f] animate-pulse'
                : 'border border-[#333]'
            }`}>
              {done ? '✓' : ''}
            </div>
            <span className={`text-sm font-medium ${
              done ? 'text-[#00d68f]' : active ? 'text-white' : 'text-[#555]'
            }`}>
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}
