'use client'

import { Button } from '@/components/ui/button'
import { logoutAdmin } from '@/actions/admin-auth'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Settings, Users, FileText, MessageSquare, ArrowLeft, Image as ImageIcon, List, Layers, Quote as QuoteIcon } from 'lucide-react'
import AdminMessages from '@/components/admin/admin-messages'
import AdminProjects from '@/components/admin/admin-projects'
import AdminProjectForm from '@/components/admin/admin-project-form'
import AdminPortfolioImages from '@/components/admin/admin-portfolio-images'
import AdminPortfolioImageForm from '@/components/admin/admin-portfolio-image-form'
import AdminProcessSteps from '@/components/admin/admin-process-steps'
import AdminMaterials from '@/components/admin/admin-materials'
import AdminTestimonials from '@/components/admin/admin-testimonials'
import { getContactMessages } from '@/actions/contact-messages'
import { getProjects } from '@/actions/projects'
import { getPortfolioProjects } from '@/actions/portfolio-images'
import { getProcessSteps } from '@/actions/process-steps'
import { getMaterialQualities } from '@/actions/materials'
import { getTestimonials } from '@/actions/testimonials'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const router = useRouter()
  const [messageCount, setMessageCount] = useState(0)
  const [countError, setCountError] = useState<string | null>(null)
  const [projectCount, setProjectCount] = useState(0)
  const [portfolioImageCount, setPortfolioImageCount] = useState(0)
  const [processStepCount, setProcessStepCount] = useState(0)
  const [materialQualityCount, setMaterialQualityCount] = useState(0)
  const [testimonialCount, setTestimonialCount] = useState(0)
  const [currentView, setCurrentView] = useState<'dashboard' | 'projects' | 'portfolio' | 'messages' | 'process' | 'materials' | 'testimonials'>('dashboard')
  const [editingProject, setEditingProject] = useState<any>(null)
  const [editingPortfolioImage, setEditingPortfolioImage] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchProjectCount = async () => {
    try {
      const result = await getProjects()
      if (result.success) {
        setProjectCount(result.projects.length)
      }
    } catch (error) {
      console.error('Error fetching project count:', error)
    }
  }

  const fetchPortfolioImageCount = async () => {
    try {
      const result = await getPortfolioProjects()
      if (result.success) {
        setPortfolioImageCount(result.projects.length)
      }
    } catch (error) {
      console.error('Error fetching portfolio project count:', error)
    }
  }

  const fetchProcessStepCount = async () => {
    try {
      const result = await getProcessSteps()
      if (result.success) {
        setProcessStepCount(result.steps.length)
      }
    } catch (error) {
      console.error('Error fetching process step count:', error)
    }
  }

  const fetchMaterialQualityCount = async () => {
    try {
      const result = await getMaterialQualities()
      if (result.success) {
        setMaterialQualityCount(result.qualities.length)
      }
    } catch (error) {
      console.error('Error fetching material quality count:', error)
    }
  }

  const fetchTestimonialCount = async () => {
    try {
      const result = await getTestimonials()
      if (result.success) {
        setTestimonialCount(result.testimonials.length)
      }
    } catch (error) {
      console.error('Error fetching testimonial count:', error)
    }
  }

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
    fetchProjectCount()
  }, [])

  useEffect(() => {
    fetchPortfolioImageCount()
  }, [])

  useEffect(() => {
    fetchProcessStepCount()
  }, [])

  useEffect(() => {
    fetchMaterialQualityCount()
  }, [])

  useEffect(() => {
    fetchTestimonialCount()
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
    setEditingPortfolioImage(null)
    setIsFormOpen(false)
  }

  const handleFormSuccess = () => {
    setEditingProject(null)
    setEditingPortfolioImage(null)
    setIsFormOpen(false)
    if (currentView === 'projects') {
      fetchProjectCount()
    } else if (currentView === 'portfolio') {
      fetchPortfolioImageCount()
    }
  }

  const handleCreatePortfolioImage = () => {
    setEditingPortfolioImage(null)
    setIsFormOpen(true)
  }

  const handleEditPortfolioImage = (image: any) => {
    setEditingPortfolioImage(image)
    setIsFormOpen(true)
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
              {currentView === 'projects' ? 'Gestión de Proyectos' : currentView === 'portfolio' ? 'Gestión de Portfolio' : currentView === 'messages' ? 'Mensajes' : currentView === 'process' ? 'Configuración del Proceso' : currentView === 'materials' ? 'Configuración de Materiales' : currentView === 'testimonials' ? 'Configuración de Testimonios' : 'Panel de Administración'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                onClick={() => setCurrentView('portfolio')}
                className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6 hover:border-gold/40 transition-colors duration-300 text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-gold"><ImageIcon className="w-8 h-8" /></div>
                  <span className="text-2xl font-serif text-cream">{portfolioImageCount}</span>
                </div>
                <h3 className="font-serif text-lg text-cream mb-2">Portfolio</h3>
                <p className="text-cream/60 text-sm">Gestiona las imágenes del portfolio</p>
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
              <button
                onClick={() => setCurrentView('process')}
                className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6 hover:border-gold/40 transition-colors duration-300 text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-gold"><List className="w-8 h-8" /></div>
                  <span className="text-2xl font-serif text-cream">{processStepCount}</span>
                </div>
                <h3 className="font-serif text-lg text-cream mb-2">Proceso</h3>
                <p className="text-cream/60 text-sm">Configura los pasos del proceso</p>
              </button>
              <button
                onClick={() => setCurrentView('materials')}
                className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6 hover:border-gold/40 transition-colors duration-300 text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-gold"><Layers className="w-8 h-8" /></div>
                  <span className="text-2xl font-serif text-cream">{materialQualityCount}</span>
                </div>
                <h3 className="font-serif text-lg text-cream mb-2">Materiales</h3>
                <p className="text-cream/60 text-sm">Configura el contenido y características</p>
              </button>
              <button
                onClick={() => setCurrentView('testimonials')}
                className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6 hover:border-gold/40 transition-colors duration-300 text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-gold"><QuoteIcon className="w-8 h-8" /></div>
                  <span className="text-2xl font-serif text-cream">{testimonialCount}</span>
                </div>
                <h3 className="font-serif text-lg text-cream mb-2">Testimonios</h3>
                <p className="text-cream/60 text-sm">Configura frases y testimonios</p>
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
              onProjectDeleted={fetchProjectCount}
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

        {currentView === 'portfolio' && (
          <div>
            <AdminPortfolioImages
              onEditImage={handleEditPortfolioImage}
              onCreateImage={handleCreatePortfolioImage}
              onImageDeleted={fetchPortfolioImageCount}
              isFormOpen={isFormOpen}
            />
            {isFormOpen && (
              <AdminPortfolioImageForm
                image={editingPortfolioImage}
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

        {currentView === 'process' && (
          <div>
            <AdminProcessSteps />
          </div>
        )}

        {currentView === 'materials' && (
          <div>
            <AdminMaterials />
          </div>
        )}

        {currentView === 'testimonials' && (
          <div>
            <AdminTestimonials />
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
