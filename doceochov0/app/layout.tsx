import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { getSEOMetadata } from '@/actions/seo-metadata'
import SiteThemeProvider from '@/components/site-theme-provider'
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

export async function generateMetadata(): Promise<Metadata> {
  const result = await getSEOMetadata()
  
  if (result.success && result.metadata) {
    return {
      title: result.metadata.title,
      description: result.metadata.description,
      keywords: [
        'arquitectura interior córdoba',
        'mobiliario a medida córdoba',
        'diseño de interiores premium',
        'cocinas a medida',
        'vestidores a medida',
        'amoblamientos de lujo',
      ],
      openGraph: {
        title: result.metadata.og_title,
        description: result.metadata.og_description,
        images: [
          {
            url: result.metadata.og_image,
            width: 1200,
            height: 630,
            alt: result.metadata.og_title,
          },
        ],
        type: 'website',
        locale: 'es_AR',
      },
      icons: {
        icon: result.metadata.favicon,
      },
    }
  }

  // Fallback to default metadata
  return {
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
    <html lang="es-AR" className={`${cormorant.variable} ${dmSans.variable} bg-background`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedColors = localStorage.getItem('theme-colors');
                  if (storedColors) {
                    const colors = JSON.parse(storedColors);
                    const root = document.documentElement;
                    root.style.setProperty('--petroleum-dark', colors.petroleum_dark);
                    root.style.setProperty('--gold', colors.gold);
                    root.style.setProperty('--cream', colors.cream);
                    root.style.setProperty('--petroleum', colors.petroleum_light);
                    root.style.setProperty('--sand', colors.petroleum_light);
                  }
                } catch (e) {
                  console.error('Error applying theme colors from localStorage:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased grain-overlay">
        <SiteThemeProvider>
          {children}
        </SiteThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
