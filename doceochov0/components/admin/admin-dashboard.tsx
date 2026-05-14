'use client'

import { Button } from '@/components/ui/button'
import { logoutAdmin } from '@/actions/admin-auth'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Settings, Users, FileText, MessageSquare, ArrowLeft } from 'lucide-react'
import AdminMessages from '@/components/admin/admin-messages'
import AdminProjects from '@/components/admin/admin-projects'
import AdminProjectForm from '@/components/admin/admin-project-form'
import { getContactMessages } from '@/actions/contact-messages'
import { getProjects } from '@/actions/projects'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const router = useRouter()
  const [messageCount, setMessageCount] = useState(0)
  const [countError, setCountError] = useState<string | null>(null)
  const [projectCount, setProjectCount] = useState(0)
  const [currentView, setCurrentView] = useState<'dashboard' | 'projects' | 'messages'>('dashboard')
  const [editingProject, setEditingProject] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    async function fetchMessageCount() {
      try {
        const result = await getContactMessages()
        if (result.success) {
          setMessageCount(result.messages.length)
          setCountError(null)
        } else {
          const errorMsg = `Failed to fetch message count: ${result.error}`
          console.error(errorMsg)
          setCountError(errorMsg)
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred'
        console.error('Error fetching message count:', error)
        setCountError(`Error: ${errorMsg}`)
      }
    }
    fetchMessageCount()
  }, [])

  useEffect(() => {
    async function fetchProjectCount() {
      try {
        const result = await getProjects()
        if (result.success) {
          setProjectCount(result.projects.length)
        }
      } catch (error) {
        console.error('Error fetching project count:', error)
      }
    }
    fetchProjectCount()
  }, [])

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

  const handleCreateProject = () => {
    setEditingProject(null)
    setIsFormOpen(true)
  }

  const handleEditProject = (project: any) => {
    setEditingProject(project)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setEditingProject(null)
    setIsFormOpen(false)
  }

  const handleFormSuccess = () => {
    setEditingProject(null)
    setIsFormOpen(false)
    // Refresh project count
    async function fetchProjectCount() {
      try {
        const result = await getProjects()
        if (result.success) {
          setProjectCount(result.projects.length)
        }
      } catch (error) {
        console.error('Error fetching project count:', error)
      }
    }
    fetchProjectCount()
  }

  return (
    <div className="min-h-screen bg-petroleum-dark">
      {/* Header */}
      <header className="border-b border-black/10 bg-petroleum-dark/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentView !== 'dashboard' && (
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-cream hover:text-gold transition-colors duration-300"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <LayoutDashboard className="w-6 h-6 text-gold" />
            <h1 className="font-serif text-2xl text-cream">
              {currentView === 'projects' ? 'Gestión de Proyectos' : currentView === 'messages' ? 'Mensajes' : 'Panel de Administración'}
            </h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-cream/20 text-black hover:bg-cream/10"
          >
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {currentView === 'dashboard' && (
          <>
            <div className="mb-8">
              <h2 className="font-serif text-3xl text-cream mb-2">Bienvenido/a, Admin</h2>
              <p className="text-cream/60">Gestiona el contenido de DoceOcho Studio</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setCurrentView('projects')}
                className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6 hover:border-gold/40 transition-colors duration-300 text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-gold"><FileText className="w-8 h-8" /></div>
                  <span className="text-2xl font-serif text-cream">{projectCount}</span>
                </div>
                <h3 className="font-serif text-lg text-cream mb-2">Proyectos</h3>
                <p className="text-cream/60 text-sm">Gestiona los proyectos del portfolio</p>
              </button>
              <button
                onClick={() => setCurrentView('messages')}
                className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6 hover:border-gold/40 transition-colors duration-300 text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-gold"><Users className="w-8 h-8" /></div>
                  <span className="text-2xl font-serif text-cream">{messageCount}</span>
                </div>
                <h3 className="font-serif text-lg text-cream mb-2">Mensajes</h3>
                <p className="text-cream/60 text-sm">Ver los mensajes del formulario de contacto</p>
              </button>
              <DashboardCard
                icon={<Settings className="w-8 h-8" />}
                title="Configuración"
                description="Configura la configuración del admin"
                count={0}
              />
            </div>

            {/* Messages Section */}
            <div className="mt-12">
              <h3 className="font-serif text-xl text-cream mb-4">Mensajes Recibidos</h3>
              <AdminMessages />
            </div>
          </>
        )}

        {currentView === 'projects' && (
          <div>
            <AdminProjects
              onEditProject={handleEditProject}
              onCreateProject={handleCreateProject}
              isFormOpen={isFormOpen}
            />
            {isFormOpen && (
              <AdminProjectForm
                project={editingProject}
                onClose={handleFormClose}
                onSuccess={handleFormSuccess}
              />
            )}
          </div>
        )}

        {currentView === 'messages' && (
          <div>
            <AdminMessages />
          </div>
        )}
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
