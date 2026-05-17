'use server'

import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/actions/admin-auth'
import type { AnalyticsStats, MonthlyStats } from '@/types/analytics'

export async function trackPageView(page: string) {
  try {
    const { error } = await supabase
      .from('page_views')
      .insert({
        page: page,
        visited_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error tracking page view:', error)
    }
  } catch (error) {
    console.error('Page view tracking error:', error)
  }
}

export async function getAnalyticsStats(): Promise<{
  success: boolean
  error?: string
  stats?: AnalyticsStats
}> {
  try {
    const session = await getAdminSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    if (!supabaseAdmin) {
      return {
        success: false,
        error: 'Service role client not configured',
      }
    }

    // Get total views
    const { count: totalViews, error: countError } = await supabaseAdmin
      .from('page_views')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error fetching total views:', countError)
    }

    // Get monthly stats for 2026
    const startOf2026 = new Date('2026-01-01T00:00:00.000Z')
    const endOf2026 = new Date('2026-12-31T23:59:59.999Z')

    const { data: viewsData, error: viewsError } = await supabaseAdmin
      .from('page_views')
      .select('page, visited_at')
      .gte('visited_at', startOf2026.toISOString())
      .lte('visited_at', endOf2026.toISOString())
      .order('visited_at', { ascending: true })

    if (viewsError) {
      console.error('Error fetching page views:', viewsError)
      return {
        success: false,
        error: 'Failed to fetch analytics',
      }
    }

    // Process monthly stats for 2026
    const monthlyStatsMap = new Map<string, number>()
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    // Initialize all months of 2026 with 0
    for (let month = 0; month < 12; month++) {
      const key = `2026-${month}`
      monthlyStatsMap.set(key, 0)
    }

    // Count views per month for 2026 only
    for (const view of viewsData || []) {
      const date = new Date(view.visited_at)
      if (date.getFullYear() === 2026) {
        const key = `${date.getFullYear()}-${date.getMonth()}`
        monthlyStatsMap.set(key, (monthlyStatsMap.get(key) || 0) + 1)
      }
    }

    // Convert to array for all months of 2026
    const monthlyStats: MonthlyStats[] = []
    for (let month = 0; month < 12; month++) {
      const key = `2026-${month}`
      monthlyStats.push({
        month: monthNames[month],
        year: 2026,
        count: monthlyStatsMap.get(key) || 0,
      })
    }

    // Get top pages
    const pageCounts = new Map<string, number>()
    for (const view of viewsData || []) {
      pageCounts.set(view.page, (pageCounts.get(view.page) || 0) + 1)
    }

    const topPages = Array.from(pageCounts.entries())
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      success: true,
      stats: {
        totalViews: totalViews || 0,
        monthlyStats,
        topPages,
      },
    }
  } catch (error) {
    console.error('Analytics stats error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}
