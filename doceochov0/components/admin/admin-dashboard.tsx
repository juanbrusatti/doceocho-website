'use client'

import { Button } from '@/components/ui/button'
import { logoutAdmin } from '@/actions/admin-auth'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Settings, Users, FileText } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logoutAdmin()
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect even if logout fails to ensure user leaves protected area
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-petroleum-dark">
      {/* Header */}
      <header className="border-b border-cream/10 bg-petroleum-dark/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-gold" />
            <h1 className="font-serif text-2xl text-cream">Admin Dashboard</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-cream/20 text-cream hover:bg-cream/10"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="font-serif text-3xl text-cream mb-2">Welcome, Admin</h2>
          <p className="text-cream/60">Manage your DoceOcho Studio content</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            icon={<FileText className="w-8 h-8" />}
            title="Projects"
            description="Manage portfolio projects"
            count={0}
          />
          <DashboardCard
            icon={<Users className="w-8 h-8" />}
            title="Messages"
            description="View contact form submissions"
            count={0}
          />
          <DashboardCard
            icon={<Settings className="w-8 h-8" />}
            title="Settings"
            description="Configure admin settings"
            count={0}
          />
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h3 className="font-serif text-xl text-cream mb-4">Recent Activity</h3>
          <div className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6">
            <p className="text-cream/60 text-center">No recent activity</p>
          </div>
        </div>
      </main>
    </div>
  )
}

function DashboardCard({
  icon,
  title,
  description,
  count,
}: {
  icon: React.ReactNode
  title: string
  description: string
  count: number
}) {
  return (
    <div className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6 hover:border-gold/40 transition-colors duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="text-gold">{icon}</div>
        <span className="text-2xl font-serif text-cream">{count}</span>
      </div>
      <h3 className="font-serif text-lg text-cream mb-2">{title}</h3>
      <p className="text-cream/60 text-sm">{description}</p>
    </div>
  )
}
