'use client'

import { useEffect, useState } from 'react'
import { getThemeColors } from '@/actions/theme-colors'
import type { ThemeColors } from '@/types/theme-colors'

export default function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAndApplyColors() {
      try {
        const result = await getThemeColors()
        if (result.success && result.colors) {
          const colors = result.colors
          const root = document.documentElement

          root.style.setProperty('--petroleum-dark', colors.petroleum_dark)
          root.style.setProperty('--gold', colors.gold)
          root.style.setProperty('--cream', colors.cream)
          root.style.setProperty('--petroleum', colors.petroleum_light)
          root.style.setProperty('--sand', colors.petroleum_light)

          // Save to localStorage for instant loading
          localStorage.setItem('theme-colors', JSON.stringify(colors))
        }
      } catch (error) {
        console.error('Error fetching theme colors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAndApplyColors()
  }, [])

  if (loading) {
    return <>{children}</>
  }

  return <>{children}</>
}
