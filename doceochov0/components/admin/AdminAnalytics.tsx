'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react'
import { getAnalyticsStats } from '@/actions/analytics'
import type { AnalyticsStats } from '@/types/analytics'

export default function AdminAnalytics() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getAnalyticsStats()
        if (result.success && result.stats) {
          setStats(result.stats)
          setError(null)
        } else {
          setError(result.error || 'Failed to fetch analytics')
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
        setError('An error occurred while fetching analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-cream/60">Cargando estadísticas...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6">
        <p className="text-cream/60 text-sm">No hay datos de estadísticas disponibles</p>
      </div>
    )
  }

  const maxCount = Math.max(...stats.monthlyStats.map(m => m.count), 1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl text-cream mb-2">Estadísticas del Sitio</h2>
        <p className="text-cream/60 text-sm">Visitas y métricas de uso</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-gold"><Users className="w-6 h-6" /></div>
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/60">
              Total Visitas
            </span>
          </div>
          <p className="font-serif text-3xl text-cream">{stats.totalViews.toLocaleString()}</p>
        </div>

        <div className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-gold"><TrendingUp className="w-6 h-6" /></div>
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/60">
              Últimos 12 Meses
            </span>
          </div>
          <p className="font-serif text-3xl text-cream">
            {stats.monthlyStats.reduce((sum, m) => sum + m.count, 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-gold"><FileText className="w-6 h-6" /></div>
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/60">
              Páginas Top
            </span>
          </div>
          <p className="font-serif text-3xl text-cream">{stats.topPages.length}</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-gold"><BarChart3 className="w-5 h-5" /></div>
          <h3 className="font-serif text-lg text-cream">Visitas por Mes</h3>
        </div>
        <div className="flex items-end justify-between gap-2 h-48">
          {stats.monthlyStats.map((stat) => {
            const height = (stat.count / maxCount) * 100
            return (
              <div key={`${stat.year}-${stat.month}`} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-petroleum-dark/30 rounded-t relative group">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gold transition-all duration-300 rounded-t"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-petroleum-dark text-cream text-xs px-2 py-1 rounded opacity-100 transition-opacity whitespace-nowrap">
                    {stat.count} visitas
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-sans text-[10px] text-cream/70">{stat.month}</p>
                  <p className="font-sans text-[9px] text-cream/50">{stat.year}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-gold"><FileText className="w-5 h-5" /></div>
          <h3 className="font-serif text-lg text-cream">Páginas Más Visitadas</h3>
        </div>
        <div className="space-y-3">
          {stats.topPages.length === 0 ? (
            <p className="text-cream/60 text-sm">No hay datos de páginas visitadas</p>
          ) : (
            stats.topPages.map((page, index) => (
              <div
                key={page.page}
                className="flex items-center justify-between p-3 bg-petroleum-dark/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="font-sans text-sm text-gold/60">#{index + 1}</span>
                  <span className="font-sans text-sm text-cream">{page.page}</span>
                </div>
                <span className="font-sans text-sm text-cream/70">{page.count} visitas</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
