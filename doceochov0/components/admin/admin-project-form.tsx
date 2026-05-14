'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { createProject, updateProject, updateProjectImage } from '@/actions/projects'

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

interface AdminProjectFormProps {
  project: Project | null
  onClose: () => void
  onSuccess: () => void
}

export default function AdminProjectForm({ project, onClose, onSuccess }: AdminProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    category: 'Residencial' as 'Residencial' | 'Comercial' | 'Mobiliario',
    description: '',
    year: new Date().getFullYear().toString(),
    size: 'large' as 'large' | 'small',
  })

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        category: project.category,
        description: project.description,
        year: project.year,
        size: project.size,
      })
      setImagePreview(project.image_path)
    }
  }, [project])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      const preview = URL.createObjectURL(file)
      setImagePreview(preview)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (project) {
        // Update existing project
        const result = await updateProject(project.id, formData)
        if (!result.success) {
          setError(result.error || 'Failed to update project')
          setIsSubmitting(false)
          return
        }

        // Update image if changed
        if (imageFile) {
          const imageResult = await updateProjectImage(project.id, imageFile)
          if (!imageResult.success) {
            setError(imageResult.error || 'Failed to update image')
            setIsSubmitting(false)
            return
          }
        }
      } else {
        // Create new project
        if (!imageFile) {
          setError('La imagen es obligatoria')
          setIsSubmitting(false)
          return
        }

        const result = await createProject({
          ...formData,
          imageFile,
        })
        if (!result.success) {
          setError(result.error || 'Failed to create project')
          setIsSubmitting(false)
          return
        }
      }

      onSuccess()
    } catch (error) {
      setError('An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-petroleum-dark border border-cream/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-petroleum-dark border-b border-cream/10 p-6 flex items-center justify-between">
          <h2 className="font-serif text-xl text-cream">
            {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-cream hover:text-gold transition-colors duration-300 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40 block mb-2">
              Imagen {project && '(opcional)'}
            </label>
            <div className="border-2 border-dashed border-cream/20 rounded-lg p-6 hover:border-gold/40 transition-colors duration-300">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="hidden"
                id="project-image"
              />
              <label
                htmlFor="project-image"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                {imagePreview ? (
                  <div className="relative w-full aspect-video">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-cream">
                        <Upload className="w-5 h-5" />
                        Cambiar imagen
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-cream/40">
                    <ImageIcon className="w-12 h-12" />
                    <span className="text-sm">Click para subir imagen</span>
                    <span className="text-xs">PNG, JPG hasta 10MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40 block mb-2">
              Título
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={isSubmitting}
              className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 text-cream focus:border-gold outline-none transition-colors duration-300 disabled:opacity-50"
              placeholder="Ej: Casa Olivos"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40 block mb-2">
              Categoría
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              disabled={isSubmitting}
              className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 text-cream focus:border-gold outline-none transition-colors duration-300 disabled:opacity-50"
            >
              <option value="Residencial" className="bg-petroleum-dark">Residencial</option>
              <option value="Comercial" className="bg-petroleum-dark">Comercial</option>
              <option value="Mobiliario" className="bg-petroleum-dark">Mobiliario</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40 block mb-2">
              Año
            </label>
            <input
              id="year"
              type="text"
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              disabled={isSubmitting}
              className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 text-cream focus:border-gold outline-none transition-colors duration-300 disabled:opacity-50"
              placeholder="Ej: 2024"
            />
          </div>

          {/* Size */}
          <div>
            <label htmlFor="size" className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40 block mb-2">
              Tamaño
            </label>
            <select
              id="size"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value as any })}
              disabled={isSubmitting}
              className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 text-cream focus:border-gold outline-none transition-colors duration-300 disabled:opacity-50"
            >
              <option value="large" className="bg-petroleum-dark">Large (ancho completo)</option>
              <option value="small" className="bg-petroleum-dark">Small (medio ancho)</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40 block mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isSubmitting}
              rows={4}
              className="w-full bg-transparent border border-cream/20 rounded-lg px-4 py-3 text-cream focus:border-gold outline-none transition-colors duration-300 resize-none disabled:opacity-50"
              placeholder="Describe el proyecto..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 font-sans text-[11px] tracking-[0.4em] uppercase py-3 px-6 border border-cream/20 text-cream hover:border-gold hover:text-gold transition-colors duration-300 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gold text-petroleum-dark font-sans text-[11px] tracking-[0.4em] uppercase py-3 px-6 hover:bg-cream transition-colors duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : project ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
