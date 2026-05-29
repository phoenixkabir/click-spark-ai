'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MARQUEE_ITEMS = [
  'Meta Ads · win now',
  'AI UGC · subconscious layer',
  'LinkedIn · YouTube · SEO · win forever',
  'TRIBE v2 · 720 subjects · 70,000 regions',
  'score before you spend',
  'distribution OS for companies',
  'paid · owned · earned · in one system',
  '1,200 hrs of fMRI brain data',
]

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.20em' }
const SERIF: React.CSSProperties = { fontFamily: 'var(--font-serif)' }

function SectionRule({ num, title }: { num: string; title: string }) {
  return (
    <div style={{
      borderTop: '1px solid #1a1814',
      borderBottom: '1px solid var(--rule)',
      padding: '14px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={{ ...MONO, color: '#6a6258' }}>
        <span style={{ color: '#8b2e2e', marginRight: '10px' }}>§ {num}</span>
        {title}
      </span>
      <span style={{ ...MONO, color: '#6a6258' }}>Click Spark · Distribution OS</span>
    </div>
  )
}

export default function LandingPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    try {
      router.push(`/analyze?url=${encodeURIComponent(url.trim())}`)
    } finally {
      setLoading(false)
    }
  }

  const marqueeContent = [
    ...MARQUEE_ITEMS.map((item, i) => (
      <span key={`a${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '18px' }}>
        <span style={{ ...MONO, color: '#6a6258', letterSpacing: '0.22em' }}>{item}</span>
        <span style={{ color: '#8b2e2e', fontSize: '10px', marginRight: '18px' }}>◆</span>
      </span>
    )),
    ...MARQUEE_ITEMS.map((item, i) => (
      <span key={`b${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '18px' }}>
        <span style={{ ...MONO, color: '#6a6258', letterSpacing: '0.22em' }}>{item}</span>
        <span style={{ color: '#8b2e2e', fontSize: '10px', marginRight: '18px' }}>◆</span>
      </span>
    )),
  ]

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4efe6' }}>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid #1a1814',
        padding: '18px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        background: '#f4efe6',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ color: '#8b2e2e', ...SERIF, fontSize: '18px' }}>◆</span>
          <span style={{ ...SERIF, fontSize: '18px', color: '#1a1814' }}>
            Click Spark<span style={{ color: '#8b2e2e' }}>.</span>
          </span>
          <span style={{ ...MONO, color: '#a39c8e', fontSize: '10px', letterSpacing: '0.18em', marginLeft: '2px' }}>Distribution OS</span>
        </div>

        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {([
            ['How it works', '#how-it-works'],
            ['Sample report', '/sample'],
            ['Score a creative', '/score'],
            ['Pricing', '/coming-soon'],
          ] as [string, string][]).map(([l, href]) => (
            <a key={l} href={href} style={{ ...MONO, color: '#a39c8e', textDecoration: 'none', letterSpacing: '0.18em' }}>{l}</a>
          ))}
        </div>

        <a href="/dashboard" style={{
          ...MONO,
          color: '#fbf7ee',
          background: '#8b2e2e',
          border: 'none',
          padding: '10px 14px',
          textDecoration: 'none',
          letterSpacing: '0.16em',
          display: 'inline-block',
        }}>Launch the OS →</a>
      </nav>

      {/* Hero */}
      <section style={{ padding: '56px 40px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '56px', alignItems: 'start' }}>

          <div>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ ...MONO, color: '#8b2e2e', letterSpacing: '0.22em', borderBottom: '1px solid #8b2e2e', paddingBottom: '2px' }}>
                paid · subconscious · owned — all in one system
              </span>
            </div>

            <h1 style={{ ...SERIF, fontSize: '100px', lineHeight: 0.92, letterSpacing: '-0.025em', margin: 0 }}>
              <span style={{ color: '#1a1814', display: 'block' }}>Building is easy.</span>
              <em style={{ color: '#8b2e2e', fontStyle: 'italic', display: 'block' }}>Being noticed</em>
              <span style={{ color: '#6a6258', display: 'block' }}>is the hard part.</span>
            </h1>

            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', color: '#6a6258', lineHeight: 1.55, maxWidth: '520px', marginTop: '28px' }}>
              ClipSpark is the distribution OS for companies that shipped. Three engines running in parallel: Meta Ads to win now, AI UGC running in the background as your subconscious layer, and owned content compounding forever. Every piece scored against TRIBE v2 — the brain model trained on 1,200 hours of real fMRI — before it goes out.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <a href="/dashboard" style={{
                background: '#1a1814',
                color: '#fbf7ee',
                padding: '16px 24px',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}>
                Open the dashboard →
              </a>
              <a href="/score" style={{
                background: 'transparent',
                color: '#1a1814',
                padding: '16px 24px',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                border: '1px solid rgba(26,24,20,0.2)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}>
                Score a creative first
              </a>
            </div>

            <div style={{ marginTop: '16px' }}>
              <a href="/sample" style={{ ...MONO, color: '#a39c8e', textDecoration: 'underline', letterSpacing: '0.18em' }}>
                See a sample brain report ↗
              </a>
            </div>
          </div>

          {/* Right col — OS status card */}
          <div style={{ borderLeft: '1px solid var(--rule)', paddingLeft: '40px' }}>
            <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '16px' }}>Distribution OS · live status</div>
            {[
              { layer: '01 · Paid', label: 'Meta Ads', status: 'RUNNING', detail: '3 campaigns · ROAS 4.2×', color: '#8b2e2e' },
              { layer: '02 · UGC', label: 'AI UGC', status: 'ACTIVE', detail: '12 videos live · 84K views', color: '#6a6258' },
              { layer: '03 · Owned', label: 'Organic', status: 'PUBLISHING', detail: '4 posts this week', color: '#a39c8e' },
            ].map(({ layer, label, status, detail, color }) => (
              <div key={layer} style={{
                borderTop: '1px solid var(--rule)',
                padding: '16px 0',
                display: 'grid',
                gridTemplateColumns: '90px 1fr auto',
                gap: '12px',
                alignItems: 'center',
              }}>
                <span style={{ ...MONO, color: '#a39c8e' }}>{layer}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#1a1814', fontWeight: 500 }}>{label}</div>
                  <div style={{ ...MONO, color: '#a39c8e', marginTop: '2px' }}>{detail}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, display: 'inline-block' }} />
                  <span style={{ ...MONO, color, fontSize: '9px' }}>{status}</span>
                </div>
              </div>
            ))}
            <div style={{ borderTop: '2px solid #1a1814', marginTop: '8px', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ ...MONO, color: '#a39c8e' }}>TRIBE v2 avg score</span>
                <span style={{ ...SERIF, fontSize: '28px', color: '#8b2e2e', fontVariantNumeric: 'tabular-nums' }}>84</span>
              </div>
              <div style={{ height: '3px', background: 'var(--rule)', marginTop: '8px' }}>
                <div style={{ height: '100%', width: '84%', background: '#8b2e2e' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div style={{
        borderTop: '1px solid #1a1814', borderBottom: '1px solid #1a1814',
        background: '#fbf7ee',
        padding: '14px 0',
        overflow: 'hidden',
      }}>
        <div
          style={{ display: 'flex', width: 'max-content', animation: 'marquee 35s linear infinite' }}
          onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {marqueeContent}
        </div>
      </div>

      {/* §01 — Win Now: Meta Ads */}
      <div id="how-it-works" />
      <SectionRule num="01" title="Win Now · Meta Ads Engine" />
      <section style={{ padding: '40px 40px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '56px' }}>
          <div>
            <h2 style={{ ...SERIF, fontSize: '64px', lineHeight: 0.95, letterSpacing: '-0.02em', color: '#1a1814', margin: 0 }}>
              Score before<br />
              <em style={{ color: '#8b2e2e', fontStyle: 'italic' }}>you spend.</em>
            </h2>
            <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '18px', color: '#6a6258', marginTop: '16px' }}>
              Every ad gets a TRIBE v2 brain score before it reaches a single dollar of spend. Connect your Meta account. The model does the rest.
            </p>
            <a href="/dashboard/paid" style={{
              display: 'inline-block', marginTop: '24px',
              ...MONO, color: '#fbf7ee', background: '#8b2e2e',
              padding: '12px 18px', textDecoration: 'none', letterSpacing: '0.18em',
            }}>Open Ads Engine →</a>
          </div>

          <div>
            {[
              { step: '01', title: 'Paste your creative.', body: 'Drop the hook, visual description, and script. Or paste everything in one block — we parse it.' },
              { step: '02', title: 'Get the brain score.', body: 'TRIBE v2 runs against 70,000 cortical regions. You see Reward, Attention, Emotion, Memory — and exactly why each number landed where it did.' },
              { step: '03', title: 'Launch directly to Meta.', body: 'Connect your Ads Manager. Set budget, targeting, and schedule. The campaign goes live from inside Click Spark — no switching tabs.' },
              { step: '04', title: 'Track real outcomes.', body: 'CTR, ROAS, CPA — all flowing back. Every campaign that runs trains the model to predict the next one better.' },
            ].map(({ step, title, body }, i) => (
              <article key={step} style={{
                display: 'grid', gridTemplateColumns: '56px 1fr',
                gap: '20px', padding: '20px 0',
                borderTop: i === 0 ? '1px solid #1a1814' : '1px solid var(--rule)',
              }}>
                <span style={{ ...MONO, color: '#8b2e2e' }}>{step}</span>
                <div>
                  <h3 style={{ ...SERIF, fontSize: '24px', color: '#1a1814', margin: '0 0 6px' }}>{title}</h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#6a6258', lineHeight: 1.55, margin: 0 }}>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section style={{
        background: '#fbf7ee',
        padding: '64px 40px',
        borderTop: '1px solid #1a1814',
        borderBottom: '1px solid #1a1814',
      }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ ...SERIF, fontSize: '200px', fontStyle: 'italic', color: '#8b2e2e', lineHeight: 0.6, height: '60px', overflow: 'hidden', userSelect: 'none' }}>"</div>
          <blockquote style={{ margin: '0' }}>
            <p style={{ ...SERIF, fontSize: '44px', lineHeight: 1.18, letterSpacing: '-0.015em', color: '#1a1814', margin: 0 }}>
              Most ads get scored after they fail.{' '}
              <em style={{ color: '#8b2e2e', fontStyle: 'italic' }}>We score them before.</em>
              {' '}The brain knows in two seconds. We give you the receipt before you spend a dollar.
            </p>
          </blockquote>
          <p style={{ ...MONO, color: '#a39c8e', letterSpacing: '0.22em', marginTop: '28px' }}>— the thesis · why prediction beats testing</p>
        </div>
      </section>

      {/* §02 — Subconscious Layer: AI UGC */}
      <SectionRule num="02" title="Subconscious Layer · AI UGC" />
      <section style={{ padding: '40px 40px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '56px', alignItems: 'start' }}>
          <div>
            {[
              {
                tag: 'What it is',
                title: 'The ads that don\'t feel like ads.',
                body: 'AI-generated creator-style videos running quietly across accounts in your niche. Not branded. Not polished. They feel native because they\'re built to feel native — same energy as the feed, same formats that already work.',
              },
              {
                tag: 'How it runs',
                title: 'Brief in. Videos out. Accounts running.',
                body: 'You give us the brand brief. We generate the scripts — hook, body, CTA — calibrated to the platform and the creator persona. The UGC goes live on creator accounts. You watch the view counts.',
              },
              {
                tag: 'Why it compounds',
                title: 'Every view is a brand impression you didn\'t pay ad rates for.',
                body: 'Organic UGC views compound over time. A video that hits the algorithm keeps running for months. The subconscious layer builds familiarity that makes the paid ads convert better. Both layers feed each other.',
              },
            ].map(({ tag, title, body }, i) => (
              <article key={tag} style={{
                display: 'grid', gridTemplateColumns: '140px 1fr', gap: '28px',
                padding: '24px 0',
                borderTop: i === 0 ? '1px solid #1a1814' : '1px solid var(--rule)',
              }}>
                <span style={{ ...MONO, color: '#8b2e2e' }}>{tag}</span>
                <div>
                  <h3 style={{ ...SERIF, fontSize: '28px', color: '#1a1814', margin: '0 0 8px', lineHeight: 1.1 }}>{title}</h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#6a6258', lineHeight: 1.55, margin: 0 }}>{body}</p>
                </div>
              </article>
            ))}
          </div>

          <div style={{ borderLeft: '1px solid var(--rule)', paddingLeft: '40px', position: 'sticky', top: '80px' }}>
            <div style={{ ...MONO, color: '#a39c8e', marginBottom: '16px' }}>UGC · live creator accounts</div>
            {[
              { handle: '@dailygrind.co', views: '23.4K', score: 88, platform: 'TikTok', status: 'LIVE' },
              { handle: '@buildershub', views: '11.2K', score: 76, platform: 'Reels', status: 'LIVE' },
              { handle: '@founder.feed', views: '8.9K', score: 81, platform: 'TikTok', status: 'EDITING' },
            ].map(({ handle, views, score, platform, status }) => (
              <div key={handle} style={{ borderTop: '1px solid var(--rule)', padding: '14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#1a1814', fontWeight: 500 }}>{handle}</span>
                  <span style={{ ...MONO, color: status === 'LIVE' ? '#8b2e2e' : '#a39c8e', fontSize: '9px' }}>{status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ ...MONO, color: '#a39c8e' }}>{platform} · {views} views</span>
                  <span style={{ ...MONO, color: '#6a6258' }}>score {score}</span>
                </div>
              </div>
            ))}
            <a href="/dashboard/ugc" style={{
              display: 'block', marginTop: '16px',
              ...MONO, color: '#1a1814', textDecoration: 'none',
              borderTop: '2px solid #1a1814', paddingTop: '12px',
            }}>Open UGC Engine →</a>
          </div>
        </div>
      </section>

      {/* §03 — Win Forever: Organic */}
      <SectionRule num="03" title="Win Forever · Organic Distribution" />
      <section style={{ padding: '40px 40px 56px', background: '#fbf7ee' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '56px' }}>
          <div>
            <h2 style={{ ...SERIF, fontSize: '64px', lineHeight: 0.95, letterSpacing: '-0.02em', color: '#1a1814', margin: 0 }}>
              Content that<br />
              <em style={{ color: '#8b2e2e', fontStyle: 'italic' }}>compounds.</em>
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: '#6a6258', lineHeight: 1.6, marginTop: '20px' }}>
              One brand brief generates a full content calendar: LinkedIn posts, YouTube scripts, SEO articles. All scored before they publish. All designed to build the audience that makes every future ad cheaper to run.
            </p>
            <a href="/dashboard/organic" style={{
              display: 'inline-block', marginTop: '24px',
              ...MONO, color: '#1a1814', textDecoration: 'none',
              borderBottom: '1px solid #1a1814', paddingBottom: '2px',
            }}>Open Content Engine →</a>
          </div>

          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              {[
                { platform: 'LinkedIn', type: 'thought leadership', output: '5 posts / week', icon: '🔗' },
                { platform: 'YouTube', type: 'long-form scripts', output: '2 videos / week', icon: '▶' },
                { platform: 'SEO', type: 'keyword articles', output: '4 articles / month', icon: '◎' },
              ].map(({ platform, type, output, icon }) => (
                <div key={platform} style={{
                  border: '1px solid var(--rule)',
                  borderTop: '2px solid #1a1814',
                  padding: '20px',
                  background: '#fbf7ee',
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '12px' }}>{icon}</div>
                  <div style={{ ...MONO, color: '#8b2e2e', marginBottom: '6px' }}>{platform}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#6a6258', lineHeight: 1.5 }}>{type}</div>
                  <div style={{ ...MONO, color: '#1a1814', marginTop: '12px' }}>{output}</div>
                </div>
              ))}
            </div>
            <p style={{ ...SERIF, fontStyle: 'italic', fontSize: '16px', color: '#6a6258', marginTop: '24px', lineHeight: 1.5 }}>
              "The dogfooding loop. Every ad, post, and UGC video we ship is built by ClipSpark. The whole company is the demo. Anyone can copy the code. No one can copy the proof."
            </p>
          </div>
        </div>
      </section>

      {/* §04 — The intelligence layer */}
      <SectionRule num="04" title="The Intelligence Layer · TRIBE v2" />
      <section style={{ padding: '40px 40px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '56px', alignItems: 'center' }}>
          <div>
            <h2 style={{ ...SERIF, fontSize: '56px', lineHeight: 0.95, letterSpacing: '-0.02em', color: '#1a1814', margin: 0 }}>
              Everything scored<br />before it ships.
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: '#6a6258', lineHeight: 1.6, marginTop: '20px', maxWidth: '480px' }}>
              Meta&rsquo;s TRIBE v2 is a foundation model trained on 1,200 hours of fMRI brain scans across 720 subjects. It predicts how 20,484 cortical vertices respond to video, second by second. We run it on every creative before it leaves the platform — paid, UGC, or organic.
            </p>
            <div style={{ display: 'flex', gap: '40px', marginTop: '32px' }}>
              {[['720', 'real subjects'], ['70K', 'cortical regions'], ['1,200h', 'of fMRI data']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ ...SERIF, fontSize: '40px', color: '#8b2e2e', lineHeight: 1 }}>{num}</div>
                  <div style={{ ...MONO, color: '#a39c8e', marginTop: '4px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {[
              { network: 'Reward', pct: '30%', desc: '"I want to share this."', region: 'Orbitofrontal cortex' },
              { network: 'Attention', pct: '25%', desc: '"I can\'t look away."', region: 'Parietal + frontal' },
              { network: 'Emotion', pct: '25%', desc: '"This makes me feel."', region: 'Insula + cingulate' },
              { network: 'Memory', pct: '20%', desc: '"I\'ll remember this."', region: 'Parahippocampal + DMN' },
            ].map(({ network, pct, desc, region }, i) => (
              <div key={network} style={{
                borderTop: i === 0 ? '2px solid #1a1814' : '1px solid var(--rule)',
                padding: '14px 0',
                display: 'grid', gridTemplateColumns: '90px 1fr 40px', gap: '12px', alignItems: 'baseline',
              }}>
                <span style={{ ...MONO, color: '#8b2e2e' }}>{network}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#1a1814', fontStyle: 'italic' }}>{desc}</div>
                  <div style={{ ...MONO, color: '#a39c8e', marginTop: '2px' }}>{region}</div>
                </div>
                <span style={{ ...MONO, color: '#6a6258', textAlign: 'right' }}>{pct}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section style={{
        background: '#1a1814',
        padding: '56px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ ...MONO, color: '#a39c8e', marginBottom: '12px' }}>Ready to run the OS?</div>
          <h2 style={{ ...SERIF, fontSize: '48px', color: '#fbf7ee', margin: 0, lineHeight: 1 }}>
            Start with a<br />
            <em style={{ color: '#8b2e2e' }}>brain score.</em>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/dashboard" style={{
            background: '#8b2e2e', color: '#fbf7ee',
            padding: '16px 28px',
            fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500,
            textDecoration: 'none', letterSpacing: '0.02em',
          }}>Open the dashboard →</a>
          <a href="/score" style={{
            background: 'transparent', color: '#fbf7ee',
            padding: '16px 28px',
            fontFamily: 'var(--font-sans)', fontSize: '14px',
            border: '1px solid rgba(251,247,238,0.2)',
            textDecoration: 'none', letterSpacing: '0.02em',
          }}>Score a creative</a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #1a1814',
        padding: '28px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#f4efe6',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ color: '#8b2e2e', ...SERIF, fontSize: '16px' }}>◆</span>
          <span style={{ ...SERIF, fontSize: '16px', color: '#1a1814' }}>Click Spark<span style={{ color: '#8b2e2e' }}>.</span></span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[['Dashboard', '/dashboard'], ['Score', '/score'], ['Waitlist', '/waitlist'], ['Contact', '/coming-soon']].map(([l, h]) => (
            <a key={l} href={h} style={{ ...MONO, color: '#a39c8e', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <span style={{ ...MONO, color: '#a39c8e' }}>Powered by TRIBE v2 · Meta AI Research</span>
      </footer>

    </main>
  )
}
