export interface PageView {
  id: string
  page: string
  visited_at: string
}

export interface MonthlyStats {
  month: string
  year: number
  count: number
}

export interface AnalyticsStats {
  totalViews: number
  monthlyStats: MonthlyStats[]
  topPages: Array<{
    page: string
    count: number
  }>
}
