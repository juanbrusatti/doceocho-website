import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DoceOcho Studio — Arquitectura Interior & Mobiliario a Medida',
  description:
    'Estudio de arquitectura interior y mobiliario de autor en Córdoba, Argentina. Proyectos residenciales y comerciales de alto nivel. Diseño, fabricación e instalación integral.',
  keywords: [
    'arquitectura interior córdoba',
    'mobiliario a medida córdoba',
    'diseño de interiores premium',
    'cocinas a medida',
    'vestidores a medida',
    'amoblamientos de lujo',
  ],
  openGraph: {
    title: 'DoceOcho Studio — Arquitectura Interior & Mobiliario a Medida',
    description:
      'Estudio de arquitectura interior y mobiliario de autor en Córdoba, Argentina.',
    type: 'website',
    locale: 'es_AR',
  },
  icons: {
    icon: '/icon.svg',
  },
}

export const viewport = {
  themeColor: '#0D1F1C',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" className={`${cormorant.variable} ${dmSans.variable} bg-background`}>
      <body className="font-sans antialiased grain-overlay">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
