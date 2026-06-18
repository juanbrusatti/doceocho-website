'use client'

import { useEffect } from 'react'
import { trackPageView } from '@/actions/analytics'

interface AnalyticsTrackerProps {
  page: string
}

export default function AnalyticsTracker({ page }: AnalyticsTrackerProps) {
  useEffect(() => {
    trackPageView(page)
  }, [page])

  return null
}
