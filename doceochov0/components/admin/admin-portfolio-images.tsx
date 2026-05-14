'use client'

import { useEffect, useState } from 'react'
import { getPortfolioProjects, deletePortfolioProject } from '@/actions/portfolio-images'
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import type { PortfolioProjectWithImages } from '@/types/portfolio'

interface AdminPortfolioImagesProps {
  onEditImage: (project: PortfolioProjectWithImages) => void
  onCreateImage: () => void
  onImageDeleted: () => void
  isFormOpen: boolean
}

export default function AdminPortfolioImages({ onEditImage, onCreateImage, onImageDeleted, isFormOpen }: AdminPortfolioImagesProps) {
  const [projects, setProjects] = useState<PortfolioProjectWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const result = await getPortfolioProjects()
        if (result.success) {
          setProjects(result.projects)
        } else {
          setError(result.error || 'Failed to fetch portfolio projects')
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
      const result = await deletePortfolioProject(id)
      if (result.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id))
        onImageDeleted()
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
        <p className="text-cream/60 mb-6">No hay proyectos en el portfolio todavía</p>
        {!isFormOpen && (
          <button
            onClick={onCreateImage}
            className="inline-flex items-center gap-2 text-gold hover:text-cream transition-colors duration-300"
          >
            <Plus className="w-4 h-4" />
            Agregar primer proyecto
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
            onClick={onCreateImage}
            className="flex items-center gap-2 bg-gold text-petroleum-dark font-sans text-[11px] tracking-[0.4em] uppercase py-3 px-6 hover:bg-cream transition-colors duration-300"
          >
            <Plus className="w-4 h-4" />
            Nuevo Proyecto
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-petroleum-light/20 border border-cream/10 rounded-lg overflow-hidden hover:border-gold/40 transition-colors duration-300"
          >
            {/* First image as preview */}
            <div className="relative aspect-[4/5]">
              {project.images.length > 0 ? (
                <Image
                  src={project.images[0].image_path}
                  alt={project.title || 'Portfolio project'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-petroleum-light/10 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-cream/20" />
                </div>
              )}
              {project.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-petroleum-dark/80 text-cream text-xs px-2 py-1 rounded">
                  {project.images.length} fotos
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  {project.title && (
                    <h3 className="font-serif text-lg text-cream truncate">{project.title}</h3>
                  )}
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="text-xs text-cream/40 mb-3">
                {formatDate(project.created_at)}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEditImage(project)}
                  disabled={isFormOpen}
                  className="flex items-center gap-2 text-cream hover:text-gold transition-colors duration-300 text-sm disabled:opacity-50"
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
