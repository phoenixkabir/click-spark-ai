# Click Spark AI — Demo Recording Guide

## Before Recording

1. **Fill in real API keys in `.env.local`:**
   - `ANTHROPIC_API_KEY` — from console.anthropic.com
   - `FIRECRAWL_API_KEY` — from firecrawl.dev
   - `TRIBE_ENDPOINT_URL` — from Azure (see tribe-service/DEPLOY.md)
   - `TRIBE_ENDPOINT_KEY` — from Azure (see tribe-service/DEPLOY.md)

2. **Update real TRIBE v2 scores in `lib/demo-cache.ts`:**
   - Run the 3 curl commands in tribe-service/DEPLOY.md Step 7
   - Replace the placeholder scores (43/67/91) with real values
   - The spread must be visually dramatic — if real scores are too close, tweak the content concepts in the cache

3. **Deploy to Vercel:**
   ```bash
   npx vercel --yes
   # Add env vars in Vercel dashboard → Settings → Environment Variables
   npx vercel --prod
   ```

4. **Test the deployed URL in incognito:**
   - Open `https://your-app.vercel.app` in incognito
   - Type `liquiddeath.com` → click Analyze
   - Verify dashboard loads with correct scores

## Recording the 20-Second Demo

### Browser Setup
- Resize browser to portrait format: approximately 400px wide × 720px tall
- Use a clean browser profile (no bookmarks visible)
- Close all other tabs
- Pre-type `liquiddeath.com` in a text editor to copy-paste fast

### Recording Structure

| Time | What happens |
|------|-------------|
| 0–3s | Landing page visible. Paste `liquiddeath.com`. Click Analyze. |
| 3–9s | Loading screen. Steps tick off. "Running TRIBE v2 brain encoding..." is the last step. |
| 9–17s | Dashboard reveals. Scores appear. Winner card glows green. |
| 17–20s | Hold on winner card. Big score. "Post This" badge. Cut. |

### How to Record (macOS)
```
Cmd + Shift + 5 → select portrait browser window → Record
```

Export as MP4. Required format: 9:16 portrait, max 20 seconds.

### After Recording
- Watch it back before submitting
- Confirm the score numbers are clearly readable
- Confirm "Post This" badge is visible
- Submit via JotForm along with other deliverables
