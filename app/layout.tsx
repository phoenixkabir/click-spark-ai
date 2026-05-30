import type { Metadata } from 'next'
import { Instrument_Serif, Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500'],
})
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'ClipSpark AI',
  description: 'Brain-validated content. Before you spend a rupee.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${inter.variable} ${ibmPlexMono.variable}`}
        style={{ background: '#f4efe6', color: '#1a1814', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh' }}
      >
        {children}
      </body>
    </html>
  )
}
