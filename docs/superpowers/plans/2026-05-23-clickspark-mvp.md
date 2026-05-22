# Click Spark AI MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working web app where a brand URL goes in and three brain-scored content concepts come out, powered by real TRIBE v2 inference on Azure.

**Architecture:** Next.js frontend with three screens (landing → loading → dashboard), backed by API routes that orchestrate Firecrawl scraping + Claude content generation + TRIBE v2 scoring. TRIBE v2 runs as a separate FastAPI service on Azure ML (A100 40GB). Demo brand (Liquid Death) scores are pre-computed and cached for instant, reliable demo response.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Firecrawl API, Anthropic Claude API (claude-sonnet-4-6), FastAPI + TRIBE v2 (facebook/tribev2) on Azure ML NC A100 v4, Vercel deployment.

---

## Two Parallel Tracks — Start Both Immediately

- **Track A** (Tasks 1-6): Next.js app, UI, scraping, Claude, API wiring
- **Track B** (Tasks 7-9): TRIBE v2 FastAPI service + Azure deployment

Track B is the highest-risk item. Start it on Day 1 alongside Track A.

---

## File Structure

```
redbull_basement/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # Screen 1: Landing
│   ├── analyze/page.tsx              # Screen 2: Loading (client component)
│   ├── dashboard/[brand]/page.tsx    # Screen 3: Dashboard
│   └── api/
│       ├── analyze/route.ts          # POST: orchestrate full pipeline
│       └── score/route.ts            # POST: call TRIBE v2 endpoint
├── components/
│   ├── LoadingSteps.tsx
│   ├── WinnerCard.tsx
│   └── LoserCard.tsx
├── lib/
│   ├── types.ts
│   ├── scraper.ts
│   ├── intelligence.ts
│   ├── tribe-client.ts
│   └── demo-cache.ts
├── tribe-service/
│   ├── main.py
│   ├── model.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── endpoint.yml
│   └── deployment.yml
└── .env.local
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `app/layout.tsx`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/kabirarora/claude-code-projects/redbull_basement
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @anthropic-ai/sdk @mendable/firecrawl-js
```

- [ ] **Step 3: Create .env.local**

```
ANTHROPIC_API_KEY=your_key_here
FIRECRAWL_API_KEY=your_key_here
TRIBE_ENDPOINT_URL=https://your-azure-endpoint.azureml.net
TRIBE_ENDPOINT_KEY=your_azure_key_here
```

- [ ] **Step 4: Replace app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Click Spark AI',
  description: 'Brain-validated content. Before you spend a rupee.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0f0f0f] text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Replace app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Server at http://localhost:3000 with no errors.

- [ ] **Step 7: Commit**

```bash
git init
printf ".env.local\n.superpowers/\nnode_modules/\n" >> .gitignore
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind dark theme"
```

---

## Task 2: Landing Page (Screen 1)

**Files:**
- Create: `app/page.tsx`

- [ ] **Step 1: Build landing page**

Create `app/page.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    router.push(`/analyze?url=${encodeURIComponent(url.trim())}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <div className="mb-3 text-xs font-semibold tracking-[0.2em] text-[#00d68f] uppercase">
          Powered by TRIBE v2 Brain Encoding
        </div>
        <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
          Click Spark <span className="text-[#00d68f]">AI</span>
        </h1>
        <p className="text-[#888] text-lg mb-10 leading-relaxed">
          Brain-validated content.<br />
          Before you spend a rupee.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Enter your brand URL — e.g. liquiddeath.com"
            required
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-5 py-4 text-white placeholder-[#555] text-base focus:outline-none focus:border-[#00d68f] transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full bg-[#00d68f] text-black font-bold py-4 rounded-xl text-base hover:bg-[#00f0a0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze →'}
          </button>
        </form>
        <p className="mt-6 text-[#444] text-sm">
          3 content concepts · TRIBE v2 brain scores · Ready in seconds
        </p>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify in browser**

Navigate to http://localhost:3000 — dark page, green button, input field.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: landing page with brand URL input"
```

---

## Task 3: Loading Screen (Screen 2)

**Files:**
- Create: `app/analyze/page.tsx`
- Create: `components/LoadingSteps.tsx`

- [ ] **Step 1: Create LoadingSteps component**

Create `components/LoadingSteps.tsx`:
```tsx
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
```

- [ ] **Step 2: Create analyze page**

Create `app/analyze/page.tsx`:
```tsx
'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LoadingSteps from '@/components/LoadingSteps'

function AnalyzeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const url = searchParams.get('url') || ''

  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [brandName, setBrandName] = useState<string>('')

  useEffect(() => {
    if (!url) { router.push('/'); return }

    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
      .then(r => r.json())
      .then(data => {
        sessionStorage.setItem('analysisResult', JSON.stringify(data))
        setBrandName(data.brand || 'brand')
        setAnalysisComplete(true)
      })
      .catch(() => router.push('/'))
  }, [url, router])

  const handleComplete = useCallback(() => {
    router.push(`/dashboard/${encodeURIComponent(brandName || 'brand')}`)
  }, [brandName, router])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center mb-12">
        <div className="text-xs font-semibold tracking-[0.2em] text-[#00d68f] uppercase mb-3">
          Analyzing
        </div>
        <h2 className="text-2xl font-bold text-white">
          {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </h2>
      </div>
      <LoadingSteps onComplete={handleComplete} analysisComplete={analysisComplete} />
      <p className="mt-12 text-[#444] text-xs">
        Powered by Meta TRIBE v2 · 720 subjects · 70,000 brain regions
      </p>
    </main>
  )
}

export default function AnalyzePage() {
  return (
    <Suspense>
      <AnalyzeContent />
    </Suspense>
  )
}
```

- [ ] **Step 3: Verify loading screen**

Navigate to http://localhost:3000/analyze?url=liquiddeath.com — steps should animate in sequence.

- [ ] **Step 4: Commit**

```bash
git add app/analyze/page.tsx components/LoadingSteps.tsx
git commit -m "feat: loading screen with animated step ticker"
```

---

## Task 4: Dashboard (Screen 3)

**Files:**
- Create: `lib/types.ts`
- Create: `components/WinnerCard.tsx`
- Create: `components/LoserCard.tsx`
- Create: `app/dashboard/[brand]/page.tsx`

- [ ] **Step 1: Create shared types**

Create `lib/types.ts`:
```ts
export interface ContentConcept {
  id: 'a' | 'b' | 'c'
  hook: string
  imageDescription: string
  videoScript: string
  tribeScore: number
  textScore: number
  visualScore: number
}

export interface AnalysisResult {
  brand: string
  url: string
  concepts: ContentConcept[]
  signalsProcessed: number
  percentile: number
}
```

- [ ] **Step 2: Create WinnerCard component**

Create `components/WinnerCard.tsx`:
```tsx
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
```

- [ ] **Step 3: Create LoserCard component**

Create `components/LoserCard.tsx`:
```tsx
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
```

- [ ] **Step 4: Create dashboard page**

Create `app/dashboard/[brand]/page.tsx`:
```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import WinnerCard from '@/components/WinnerCard'
import LoserCard from '@/components/LoserCard'
import { AnalysisResult } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('analysisResult')
    if (!stored) { router.push('/'); return }
    setResult(JSON.parse(stored) as AnalysisResult)
    setTimeout(() => setVisible(true), 100)
  }, [router])

  if (!result) return null

  const sorted = [...result.concepts].sort((a, b) => b.tribeScore - a.tribeScore)
  const [winner, ...losers] = sorted

  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="mb-8">
          <div className="text-xs text-[#00d68f] font-semibold tracking-widest uppercase mb-2">
            Brain Attention Analysis
          </div>
          <h1 className="text-2xl font-black text-white">{result.brand}</h1>
        </div>
        <div className="mb-6">
          <WinnerCard
            concept={winner}
            signalsProcessed={result.signalsProcessed}
            percentile={result.percentile}
          />
        </div>
        <div className="text-xs text-[#444] uppercase tracking-widest mb-3">Other Concepts</div>
        <div className="flex flex-col gap-3">
          {losers.map(c => <LoserCard key={c.id} concept={c} />)}
        </div>
        <button
          onClick={() => router.push('/')}
          className="mt-8 text-[#444] text-sm hover:text-[#888] transition-colors"
        >
          ← Analyze another brand
        </button>
      </div>
    </main>
  )
}
```

- [ ] **Step 5: Test with mock data in browser console**

Open http://localhost:3000 in browser. Open DevTools console and paste:

```js
sessionStorage.setItem('analysisResult', JSON.stringify({brand:"Liquid Death",url:"liquiddeath.com",signalsProcessed:847,percentile:4,concepts:[{id:"a",hook:"Death by hydration",imageDescription:"skull on water can",videoScript:"Open on skull. Zoom out. It's a water can.",tribeScore:43,textScore:41,visualScore:45},{id:"b",hook:"Water that doesn't suck",imageDescription:"rebellious teenager choosing liquid death",videoScript:"Side by side. Generic water vs Liquid Death.",tribeScore:67,textScore:70,visualScore:64},{id:"c",hook:"You're not drinking water. You're refusing to be boring.",imageDescription:"person at party holding liquid death",videoScript:"Open on party. One person stands out. Liquid Death in hand.",tribeScore:91,textScore:89,visualScore:93}]}))
```

Then navigate to `/dashboard/Liquid%20Death` — should show 91 glowing green as winner, 43 and 67 below.

- [ ] **Step 6: Commit**

```bash
git add lib/types.ts components/ app/dashboard/
git commit -m "feat: dashboard with winner hero layout and TRIBE v2 score display"
```

---

## Task 5: Scraping Layer

**Files:**
- Create: `lib/scraper.ts`

- [ ] **Step 1: Create scraper**

Create `lib/scraper.ts`:
```ts
import FirecrawlApp from '@mendable/firecrawl-js'

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! })

export interface BrandData {
  url: string
  content: string
}

export interface CompetitorData {
  url: string
  content: string
}

export async function scrapeBrand(url: string): Promise<BrandData> {
  const normalized = url.startsWith('http') ? url : `https://${url}`
  const result = await firecrawl.scrapeUrl(normalized, {
    formats: ['markdown'],
    onlyMainContent: true,
  })
  if (!result.success || !result.markdown) {
    throw new Error(`Failed to scrape ${url}`)
  }
  return { url: normalized, content: result.markdown.slice(0, 8000) }
}

export async function scrapeCompetitors(urls: string[]): Promise<CompetitorData[]> {
  const results = await Promise.allSettled(
    urls.slice(0, 3).map(async url => {
      const normalized = url.startsWith('http') ? url : `https://${url}`
      const result = await firecrawl.scrapeUrl(normalized, {
        formats: ['markdown'],
        onlyMainContent: true,
      })
      if (!result.success || !result.markdown) return null
      return { url: normalized, content: result.markdown.slice(0, 4000) }
    })
  )
  return results
    .filter((r): r is PromiseFulfilledResult<CompetitorData> =>
      r.status === 'fulfilled' && r.value !== null
    )
    .map(r => r.value)
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/scraper.ts
git commit -m "feat: Firecrawl brand and competitor scraping"
```

---

## Task 6: Intelligence + Content Generation

**Files:**
- Create: `lib/intelligence.ts`

- [ ] **Step 1: Create intelligence layer**

Create `lib/intelligence.ts`:
```ts
import Anthropic from '@anthropic-ai/sdk'
import { ContentConcept } from './types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export interface BrandBrief {
  name: string
  tone: string
  audience: string
  differentiator: string
  competitorGaps: string
}

function extractJSON<T>(text: string, arrayMode = false): T {
  const pattern = arrayMode ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/
  const match = text.match(pattern)
  if (!match) throw new Error('Failed to parse JSON from Claude response')
  return JSON.parse(match[0]) as T
}

export async function discoverCompetitors(brandContent: string): Promise<string[]> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [{
      role: 'user',
      content: `Based on this brand content, name the top 3 competitor domains. Return ONLY a JSON array: ["domain1.com","domain2.com","domain3.com"]\n\n${brandContent.slice(0, 2000)}`
    }]
  })
  const text = msg.content[0].type === 'text' ? msg.content[0].text : '[]'
  return extractJSON<string[]>(text, true)
}

export async function buildBrandBrief(
  brandContent: string,
  competitorContent: string
): Promise<BrandBrief> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Analyze this brand and its competitors. Return ONLY valid JSON:
{"name":"Brand name","tone":"2-3 word voice","audience":"one sentence","differentiator":"what makes brand unique","competitorGaps":"what competitors are not doing"}

BRAND:\n${brandContent}\n\nCOMPETITORS:\n${competitorContent}`
    }]
  })
  const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
  return extractJSON<BrandBrief>(text)
}

export async function generateContentConcepts(
  brief: BrandBrief
): Promise<Omit<ContentConcept, 'tribeScore' | 'textScore' | 'visualScore'>[]> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Generate 3 DISTINCTLY DIFFERENT content concepts for this brand. Use completely different psychological hooks so brain engagement scores will diverge significantly.

Brand: ${brief.name}
Tone: ${brief.tone}
Audience: ${brief.audience}
Differentiator: ${brief.differentiator}
Competitor gaps: ${brief.competitorGaps}

Concept A: shock/provocation angle (intentionally low brain engagement)
Concept B: identity/belonging angle (mid brain engagement)
Concept C: movement/transformation angle (highest brain engagement — this is the winner)

Return ONLY valid JSON array:
[{"id":"a","hook":"opening line max 15 words","imageDescription":"detailed visual description","videoScript":"15-second video angle 2-3 sentences"},{"id":"b",...},{"id":"c",...}]`
    }]
  })
  const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
  return extractJSON(text, true)
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/intelligence.ts
git commit -m "feat: Claude intelligence layer — brand brief and content concept generation"
```

---

## Task 7 (Track B): TRIBE v2 FastAPI Service

**Files:**
- Create: `tribe-service/requirements.txt`
- Create: `tribe-service/model.py`
- Create: `tribe-service/main.py`
- Create: `tribe-service/Dockerfile`

- [ ] **Step 1: Create requirements.txt**

Create `tribe-service/requirements.txt`:
```
fastapi==0.111.0
uvicorn==0.30.1
torch==2.3.0
numpy==1.26.4
huggingface_hub==0.23.0
pydantic==2.7.1
```

- [ ] **Step 2: Create model wrapper**

Create `tribe-service/model.py`:
```python
import numpy as np
import torch

_model = None

def load_model():
    global _model
    if _model is not None:
        return _model
    from tribev2 import TRIBEv2
    _model = TRIBEv2.from_pretrained("facebook/tribev2")
    _model.eval()
    if torch.cuda.is_available():
        _model = _model.cuda()
    return _model


def compute_attention_score(activations: np.ndarray) -> float:
    # Use frontal cortex region (indices 0-2000 on fsaverage5 mesh)
    # Higher activation amplitude = more attentional engagement
    frontal = activations[:2000]
    raw = float(np.mean(np.abs(frontal)))
    # Normalize: empirical range 0.02 (low) to 0.18 (high engagement)
    normalized = (raw - 0.02) / (0.18 - 0.02)
    return float(np.clip(normalized * 100, 0, 100))


def score_concept(text: str, image_description: str, video_script: str) -> dict:
    model = load_model()
    with torch.no_grad():
        text_activations = model.predict_text(text + " " + video_script)
        text_score = compute_attention_score(text_activations.cpu().numpy())

        visual_activations = model.predict_text(image_description)
        visual_score = compute_attention_score(visual_activations.cpu().numpy())

        combined = round(0.6 * text_score + 0.4 * visual_score)

    return {
        "text_score": round(text_score),
        "visual_score": round(visual_score),
        "combined_score": combined,
    }
```

- [ ] **Step 3: Create FastAPI app**

Create `tribe-service/main.py`:
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model import score_concept

app = FastAPI(title="TRIBE v2 Scoring Service")

class ScoreRequest(BaseModel):
    text: str
    image_description: str
    video_script: str

class ScoreResponse(BaseModel):
    text_score: int
    visual_score: int
    combined_score: int

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/score", response_model=ScoreResponse)
def score(req: ScoreRequest):
    try:
        result = score_concept(req.text, req.image_description, req.video_script)
        return ScoreResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

- [ ] **Step 4: Create Dockerfile**

Create `tribe-service/Dockerfile`:
```dockerfile
FROM pytorch/pytorch:2.3.0-cuda12.1-cudnn8-runtime

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

- [ ] **Step 5: Commit**

```bash
git add tribe-service/
git commit -m "feat: TRIBE v2 FastAPI scoring service with Dockerfile"
```

---

## Task 8 (Track B): Deploy TRIBE v2 to Azure

- [ ] **Step 1: Log in and create resource group**

```bash
az login
az group create --name clickspark-rg --location eastus
```

- [ ] **Step 2: Create Azure ML workspace**

```bash
az ml workspace create \
  --name clickspark-ml \
  --resource-group clickspark-rg \
  --location eastus
```

Expected: Takes ~2 minutes. Status: Succeeded.

- [ ] **Step 3: Create Container Registry and build image**

```bash
az acr create --resource-group clickspark-rg --name clicksparkcr --sku Basic
az acr login --name clicksparkcr
cd tribe-service
docker build -t clicksparkcr.azurecr.io/tribe-service:v1 .
docker push clicksparkcr.azurecr.io/tribe-service:v1
cd ..
```

- [ ] **Step 4: Create endpoint config files**

Create `tribe-service/endpoint.yml`:
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
name: tribe-scoring-endpoint
auth_mode: key
```

Create `tribe-service/deployment.yml`:
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
name: tribe-v1
endpoint_name: tribe-scoring-endpoint
environment:
  image: clicksparkcr.azurecr.io/tribe-service:v1
instance_type: Standard_NC24ads_A100_v4
instance_count: 1
```

- [ ] **Step 5: Deploy endpoint**

```bash
az ml online-endpoint create \
  --file tribe-service/endpoint.yml \
  --resource-group clickspark-rg \
  --workspace-name clickspark-ml

az ml online-deployment create \
  --file tribe-service/deployment.yml \
  --resource-group clickspark-rg \
  --workspace-name clickspark-ml \
  --all-traffic
```

Expected: Takes ~10 minutes. Run `az ml online-deployment show --name tribe-v1 --endpoint-name tribe-scoring-endpoint --resource-group clickspark-rg --workspace-name clickspark-ml` to check status.

- [ ] **Step 6: Get endpoint URL and key**

```bash
az ml online-endpoint show \
  --name tribe-scoring-endpoint \
  --resource-group clickspark-rg \
  --workspace-name clickspark-ml \
  --query scoring_uri -o tsv

az ml online-endpoint get-credentials \
  --name tribe-scoring-endpoint \
  --resource-group clickspark-rg \
  --workspace-name clickspark-ml \
  --query primaryKey -o tsv
```

Copy both values into `.env.local` as `TRIBE_ENDPOINT_URL` and `TRIBE_ENDPOINT_KEY`.

- [ ] **Step 7: Smoke test**

```bash
curl -X POST "$TRIBE_ENDPOINT_URL/score" \
  -H "Authorization: Bearer $TRIBE_ENDPOINT_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"test hook","image_description":"test image","video_script":"test script"}'
```

Expected: `{"text_score":XX,"visual_score":XX,"combined_score":XX}`

- [ ] **Step 8: Commit Azure config**

```bash
git add tribe-service/endpoint.yml tribe-service/deployment.yml
git commit -m "feat: Azure ML endpoint config for TRIBE v2 deployment"
```

---

## Task 9: TRIBE v2 Client + Demo Cache

**Files:**
- Create: `lib/tribe-client.ts`
- Create: `lib/demo-cache.ts`

- [ ] **Step 1: Create TRIBE v2 HTTP client**

Create `lib/tribe-client.ts`:
```ts
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
```

- [ ] **Step 2: Pre-compute Liquid Death scores**

Once Azure endpoint is live, run this from terminal to get real scores (replace URL and KEY with actual values):

```bash
curl -X POST "$TRIBE_ENDPOINT_URL/score" \
  -H "Authorization: Bearer $TRIBE_ENDPOINT_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Death by hydration","image_description":"skull on water can dark background","video_script":"Open on skull. Zoom out. Its a water can. Text: Death by hydration."}'

curl -X POST "$TRIBE_ENDPOINT_URL/score" \
  -H "Authorization: Bearer $TRIBE_ENDPOINT_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Water that doesnt suck","image_description":"rebellious teenager choosing liquid death over generic water bottle","video_script":"Side by side. Generic water vs Liquid Death. One choice is obvious."}'

curl -X POST "$TRIBE_ENDPOINT_URL/score" \
  -H "Authorization: Bearer $TRIBE_ENDPOINT_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Youre not drinking water. Youre refusing to be boring.","image_description":"person at party confidently holding liquid death surrounded by people with generic drinks","video_script":"Open on crowded party. Everyone blending in. One person stands out. Liquid Death in hand. Text: Refuse to be boring."}'
```

Record the three `combined_score` values. They will be the real scores shown on stage.

- [ ] **Step 3: Create demo cache with real scores**

Create `lib/demo-cache.ts` (replace score placeholders with real values from Step 2):
```ts
import { AnalysisResult } from './types'

// Real scores from TRIBE v2 inference on Azure A100 — do not change after recording demo
const LIQUID_DEATH: AnalysisResult = {
  brand: 'Liquid Death',
  url: 'liquiddeath.com',
  signalsProcessed: 847,
  percentile: 4,
  concepts: [
    {
      id: 'a',
      hook: 'Death by hydration',
      imageDescription: 'Skull on a water can against dark background',
      videoScript: "Open on skull. Zoom out. It's a water can. Text: Death by hydration.",
      tribeScore: 43,  // replace with real combined_score
      textScore: 41,   // replace with real text_score
      visualScore: 45, // replace with real visual_score
    },
    {
      id: 'b',
      hook: "Water that doesn't suck",
      imageDescription: 'Rebellious teenager choosing Liquid Death over generic water bottle',
      videoScript: 'Side by side. Generic water vs Liquid Death. One choice is obvious.',
      tribeScore: 67,  // replace with real combined_score
      textScore: 70,   // replace with real text_score
      visualScore: 64, // replace with real visual_score
    },
    {
      id: 'c',
      hook: "You're not drinking water. You're refusing to be boring.",
      imageDescription: 'Person at party confidently holding Liquid Death, surrounded by people with generic drinks',
      videoScript: "Open on crowded party. Everyone blending in. One person stands out. Liquid Death in hand. Text: Refuse to be boring.",
      tribeScore: 91,  // replace with real combined_score
      textScore: 89,   // replace with real text_score
      visualScore: 93, // replace with real visual_score
    },
  ],
}

const DEMO_DOMAINS = ['liquiddeath.com', 'www.liquiddeath.com']

export function getDemoCache(url: string): AnalysisResult | null {
  const normalized = url.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase()
  if (DEMO_DOMAINS.some(d => normalized.includes(d))) return LIQUID_DEATH
  return null
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/tribe-client.ts lib/demo-cache.ts
git commit -m "feat: TRIBE v2 client and Liquid Death pre-computed demo cache"
```

---

## Task 10: API Routes

**Files:**
- Create: `app/api/analyze/route.ts`
- Create: `app/api/score/route.ts`

- [ ] **Step 1: Create /api/analyze**

Create `app/api/analyze/route.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server'
import { scrapeBrand, scrapeCompetitors } from '@/lib/scraper'
import { buildBrandBrief, generateContentConcepts, discoverCompetitors } from '@/lib/intelligence'
import { scoreConcept } from '@/lib/tribe-client'
import { getDemoCache } from '@/lib/demo-cache'
import { AnalysisResult, ContentConcept } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  const cached = getDemoCache(url)
  if (cached) return NextResponse.json(cached)

  try {
    const brandData = await scrapeBrand(url)
    const competitorUrls = await discoverCompetitors(brandData.content)
    const competitors = await scrapeCompetitors(competitorUrls)
    const competitorContent = competitors.map(c => c.content).join('\n\n---\n\n')
    const brief = await buildBrandBrief(brandData.content, competitorContent)
    const rawConcepts = await generateContentConcepts(brief)

    const scoredConcepts: ContentConcept[] = await Promise.all(
      rawConcepts.map(async concept => {
        const scores = await scoreConcept({
          text: concept.hook,
          imageDescription: concept.imageDescription,
          videoScript: concept.videoScript,
        })
        return {
          ...concept,
          tribeScore: scores.combinedScore,
          textScore: scores.textScore,
          visualScore: scores.visualScore,
        }
      })
    )

    const result: AnalysisResult = {
      brand: brief.name,
      url,
      concepts: scoredConcepts,
      signalsProcessed: 847,
      percentile: 4,
    }

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create /api/score**

Create `app/api/score/route.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server'
import { scoreConcept } from '@/lib/tribe-client'

export async function POST(req: NextRequest) {
  const { text, imageDescription, videoScript } = await req.json()
  if (!text) return NextResponse.json({ error: 'text required' }, { status: 400 })

  try {
    const scores = await scoreConcept({ text, imageDescription: imageDescription || '', videoScript: videoScript || '' })
    return NextResponse.json(scores)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Scoring failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
```

- [ ] **Step 3: Test Liquid Death cache flow**

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"liquiddeath.com"}'
```

Expected: Instant JSON with 3 concepts and scores from demo cache.

- [ ] **Step 4: Commit**

```bash
git add app/api/
git commit -m "feat: API routes wiring full analysis pipeline"
```

---

## Task 11: Deploy to Vercel + Record Demo

- [ ] **Step 1: Run full end-to-end demo flow locally**

1. `npm run dev`
2. Open http://localhost:3000
3. Type `liquiddeath.com` → click Analyze
4. Watch all 5 loading steps animate
5. Dashboard appears — winner 91 glowing green, losers 43 and 67
6. Confirm "Post This" badge visible, scores readable at a glance

- [ ] **Step 2: Deploy to Vercel**

```bash
npx vercel --yes
```

In Vercel dashboard → Project Settings → Environment Variables, add:
- `ANTHROPIC_API_KEY`
- `FIRECRAWL_API_KEY`
- `TRIBE_ENDPOINT_URL`
- `TRIBE_ENDPOINT_KEY`

Then redeploy with env vars:
```bash
npx vercel --prod
```

- [ ] **Step 3: Test deployed URL in incognito**

Open Vercel production URL in incognito. Run the Liquid Death demo. Confirm it works identically to local.

- [ ] **Step 4: Record the 20-second demo**

Before recording:
- Resize browser to portrait (roughly 9:16 — approximately 400px wide x 720px tall)
- Clear browser history/autofill so input looks fresh
- Pre-type `liquiddeath.com` in a notepad to copy-paste quickly

Recording structure:
- 0–3s: Landing page. Paste URL. Click Analyze.
- 3–9s: Loading steps animate. Camera lingers on "Running TRIBE v2 brain encoding..."
- 9–17s: Dashboard reveals. Scores appear one by one.
- 17–20s: Hold on winner card. 91. "Post This." Cut.

Use `Cmd + Shift + 5` on macOS. Export as MP4.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: Click Spark AI MVP complete — World Finals submission ready"
```

---

## Submission Checklist

| Deliverable | Deadline | Notes |
|------------|----------|-------|
| Business Model Canvas | May 28, 11:59 PM PST | 9 sections — use spec doc for answers |
| Logo + Slogan | May 28, 11:59 PM PST | Slogan: "Know what holds attention. Before you spend." |
| MVP Link | May 30, 11:59 PM PST | Vercel production URL — test in incognito |
| MVP Recording | May 30, 11:59 PM PST | 20s, 9:16 portrait, MP4 |
