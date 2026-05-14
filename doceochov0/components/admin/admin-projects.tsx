'use client'

import { useEffect, useState } from 'react'
import { getProjects, deleteProject } from '@/actions/projects'
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface Project {
  id: string
  title: string
  category: 'Residencial' | 'Comercial' | 'Mobiliario'
  description: string
  image_path: string
  year: string
  size: 'large' | 'small'
  created_at: string
  updated_at: string
}

interface AdminProjectsProps {
  onEditProject: (project: Project) => void
  onCreateProject: () => void
  isFormOpen: boolean
}

export default function AdminProjects({ onEditProject, onCreateProject, isFormOpen }: AdminProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const result = await getProjects()
        if (result.success) {
          setProjects(result.projects)
        } else {
          setError(result.error || 'Failed to fetch projects')
        }
      } catch (err) {
        setError('An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      return
    }

    setDeletingId(id)
    try {
      const result = await deleteProject(id)
      if (result.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id))
      } else {
        alert(result.error || 'Failed to delete project')
      }
    } catch (error) {
      alert('Error al eliminar proyecto')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-cream/60">Cargando proyectos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-12 text-center">
        <ImageIcon className="w-12 h-12 text-cream/40 mx-auto mb-4" />
        <p className="text-cream/60 mb-6">No hay proyectos todavía</p>
        {!isFormOpen && (
          <button
            onClick={onCreateProject}
            className="inline-flex items-center gap-2 text-gold hover:text-cream transition-colors duration-300"
          >
            <Plus className="w-4 h-4" />
            Crear primer proyecto
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!isFormOpen && (
        <div className="flex justify-end">
          <button
            onClick={onCreateProject}
            className="flex items-center gap-2 bg-gold text-petroleum-dark font-sans text-[11px] tracking-[0.4em] uppercase py-3 px-6 hover:bg-cream transition-colors duration-300"
          >
            <Plus className="w-4 h-4" />
            Nuevo Proyecto
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-petroleum-light/20 border border-cream/10 rounded-lg overflow-hidden hover:border-gold/40 transition-colors duration-300"
          >
            <div className="flex flex-col md:flex-row gap-4 p-6">
              {/* Image */}
              <div className="relative w-full md:w-48 h-32 flex-shrink-0">
                <Image
                  src={project.image_path}
                  alt={project.title}
                  fill
                  className="object-cover rounded"
                  sizes="(max-width: 768px) 100vw, 192px"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-serif text-lg text-cream">{project.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-cream/60 mt-1">
                      <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold">
                        {project.category}
                      </span>
                      <span>•</span>
                      <span>{project.year}</span>
                      <span>•</span>
                      <span className="uppercase">{project.size}</span>
                    </div>
                  </div>
                </div>
                <p className="text-cream/70 text-sm line-clamp-2 mb-3">{project.description}</p>
                <div className="flex items-center gap-4 text-xs text-cream/40">
                  <span>Creado: {formatDate(project.created_at)}</span>
                  {project.updated_at !== project.created_at && (
                    <span>• Actualizado: {formatDate(project.updated_at)}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 md:self-center">
                <button
                  onClick={() => onEditProject(project)}
                  className="flex items-center gap-2 text-cream hover:text-gold transition-colors duration-300 text-sm"
                  disabled={isFormOpen}
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deletingId === project.id || isFormOpen}
                  className="flex items-center gap-2 text-cream hover:text-red-400 transition-colors duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  {deletingId === project.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
