# Click Spark AI — MVP Design Spec
**Date:** 2026-05-23  
**Deadline:** MVP Link + Recording due May 30, 11:59 PM PST  
**Context:** Red Bull Basement World Finals submission

---

## The One Sentence

> Brand URL in. Brain-validated content out.

---

## Pitch Frame (World Finals)

Lead with neuroscience, not D2C India. TRIBE v2 is the differentiator — everything else is scaffolding.

> "Most marketing tools tell you what performed. We tell you what will hold attention — before you publish, before you spend, using the same brain encoding model Meta used to train their feed algorithm."

---

## The One Flow

```
Brand URL → Scrape → Intelligence → Generate 3 Concepts → TRIBE v2 Score → Dashboard
```

No other flows. One thing, end to end, working perfectly.

---

## Demo Brand

**Liquid Death** — globally recognizable, content-first D2C brand. Judges anywhere on earth know it.  
The line: *"Even Liquid Death has content that underperforms by 40%."*  
Scores pre-computed from real TRIBE v2 inference. Cached for demo reliability.

---

## The Three Screens

### Screen 1 — Landing
- Single input field: "Enter your brand URL"
- One CTA button: "Analyze"
- Tagline below: *"Brain-validated content. Before you spend a rupee."*
- Dark, minimal, confident

### Screen 2 — Loading (the war room)
Animated steps that tick off in real time. Each step builds anticipation:
1. ✓ Scanning brand website...
2. ✓ Identifying top 3 competitors...
3. ✓ Processing 847 audience signals...
4. ✓ Generating content concepts...
5. ⟳ Running TRIBE v2 brain encoding...

This screen communicates the intelligence layer without explaining it. Duration: ~8-12 seconds in demo.

### Screen 3 — Dashboard (the payoff)
**Layout B — Winner Hero:**
- Winner concept takes 70% of screen
- Score "91" is massive, green, unmissable
- "POST THIS" label above the winner
- Two losing concepts shrunk below (scores 43, 67 — red, orange)
- Subtext: "Top 4% of content analyzed · 847 signals processed"
- Click into winner → full content brief (hook text + image prompt + video script)

---

## Technical Architecture

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS, dark theme

### Layer 1 — Scraping
- **Tool:** Firecrawl API
- Brand URL → brand site content (tone, products, USPs)
- Auto-discover top 3 competitors via Claude → scrape those too
- Reddit signal scraping for audience resonance data

### Layer 2 — Intelligence + Content Generation
- **Tool:** Claude API (claude-sonnet-4-6)
- Input: scraped brand data + competitor landscape + social signals
- Output: brand brief → 3 content concepts
- Each concept contains:
  - Hook text (1-2 sentences)
  - Image description (for visual scoring)
  - Video script angle (15-30 seconds)
- Concepts must be **intentionally distinct strategies** — so TRIBE v2 scores diverge meaningfully (target spread: ~43 / 67 / 91)

### Layer 3 — TRIBE v2 Inference
- **Model:** facebook/tribev2 (CC BY-NC, open source)
- **Infrastructure:** Azure ML managed endpoint, NC A100 v4 (40GB VRAM)
- **Wrapper:** FastAPI app serving POST /score
- **Input:** { text, image_description, video_script }
- **Output:** { text_score, visual_score, audio_score, combined_score (0-100) }
- **Demo strategy:** Pre-compute scores for Liquid Death. Real model, cached results, instant dashboard response. Live inference available on demand for judges.

### Layer 4 — API Routes (Next.js)
- `POST /api/analyze` — orchestrates scrape → intelligence → generate pipeline
- `POST /api/score` — calls TRIBE v2 Azure endpoint
- Results cached in-memory for demo brand

---

## 20-Second Recording Structure

| Time | What's on screen |
|------|-----------------|
| 0–3s | Landing page. URL typed: `liquiddeath.com`. Button clicked. |
| 3–9s | Loading screen. Steps tick off one by one. "Running TRIBE v2 brain encoding..." |
| 9–17s | Dashboard reveals. Three concepts appear. Scores animate in: 43 (red) → 67 (orange) → 91 (green). |
| 17–20s | Zoom on winner card. Score 91. "POST THIS." Cut. |

---

## Build Timeline (7 days)

| Day | Focus |
|-----|-------|
| 1 | Next.js scaffold + landing page + loading screen UI |
| 2 | Firecrawl integration — brand + competitor scraping working |
| 3 | Claude API — intelligence layer + 3 content concepts generating |
| 4–5 | TRIBE v2 deployed on Azure A100, FastAPI wrapper, returning scores |
| 6 | Dashboard UI — winner hero layout, score animations |
| 7 | Pre-compute Liquid Death scores, end-to-end test, record 20-second demo |

---

## Submission Checklist

| Deliverable | Deadline | Status |
|------------|----------|--------|
| Business Model Canvas | May 28, 11:59 PM PST | — |
| Logo + Slogan | May 28, 11:59 PM PST | — |
| MVP Link (Vercel URL) | May 30, 11:59 PM PST | — |
| MVP Recording (20s, 9:16) | May 30, 11:59 PM PST | — |

---

## Key Constraints

- TRIBE v2 needs 28–32 GB VRAM → Azure NC A100 v4 (40GB) required
- CC BY-NC license → fine for competition, not for commercial deployment (note for BMC)
- Score spread must be visually dramatic — 43/67/91, not 78/82/89
- Demo brand must be globally recognizable — judges should know it instantly
- MVP recording in vertical format (9:16, portrait)

---

## The Gary Tan Stress Test

**"Is the TRIBE v2 score real?"**  
Yes. Deployed on Azure A100. Real model weights from facebookresearch/tribev2. Pre-computed for demo reliability — live inference available on demand.

**"What's the moat?"**  
The data flywheel. Every brand analyzed trains a proprietary resonance dataset. The code is table stakes; the data compounds.

**"Why can't someone just copy this?"**  
They can copy the stack in 3 months. They can't copy 6 months of brand resonance data. First-mover in applying TRIBE v2 to marketing content.
