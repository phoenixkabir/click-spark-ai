'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  'Pulling the homepage and the about page',
  'Looking at five close competitors',
  'Sketching the buyer in their head',
  'Drafting three concepts that fit',
  'Running them through TRIBE v2',
]

interface LoadingStepsProps {
  onComplete: () => void
  analysisComplete: boolean
}

const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.22em' }

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
    <div style={{ width: '100%' }}>
      {STEPS.map((step, i) => {
        const done = completedSteps.includes(i)
        const active = i === currentStep && !done
        const pending = i > currentStep && !done

        const numColor = pending ? '#a39c8e' : active ? '#1a1814' : '#1a1814'
        const textColor = pending ? '#a39c8e' : done ? '#6a6258' : '#1a1814'
        const textWeight = active ? 500 : 400
        const statusColor = done ? '#6a6258' : active ? '#8b2e2e' : '#a39c8e'

        return (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '56px 1fr 110px',
              alignItems: 'baseline',
              padding: '16px 0',
              borderBottom: i < STEPS.length - 1 ? '1px solid var(--rule)' : 'none',
              transition: 'opacity 0.4s ease',
            }}
          >
            <span style={{
              ...SERIF,
              fontSize: '28px',
              color: numColor,
              fontStyle: active ? 'italic' : 'normal',
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '17px',
              color: textColor,
              fontWeight: textWeight,
            }}>
              {step}{active ? <span style={{ color: '#8b2e2e' }}> …</span> : ''}
            </span>
            <span style={{
              ...MONO,
              color: statusColor,
              textAlign: 'right',
            }}>
              {done ? 'done' : active ? 'reading…' : '—'}
            </span>
          </div>
        )
      })}

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px' }}>
        <span style={{ ...MONO, color: '#a39c8e' }}>Step {Math.min(currentStep + 1, STEPS.length)} of {STEPS.length}</span>
        <span style={{ ...MONO, color: '#a39c8e' }}>TRIBE v2 · 720 subjects · 70,000 regions</span>
      </div>
    </div>
  )
}
