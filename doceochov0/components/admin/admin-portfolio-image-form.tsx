'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Upload, Image as ImageIcon, Plus } from 'lucide-react'
import { createPortfolioProject, updatePortfolioProject, addProjectImages, deleteProjectImage } from '@/actions/portfolio-images'
import type { PortfolioProjectWithImages } from '@/types/portfolio'

interface AdminPortfolioImageFormProps {
  image: PortfolioProjectWithImages | null
  onClose: () => void
  onSuccess: () => void
}

export default function AdminPortfolioImageForm({ image, onClose, onSuccess }: AdminPortfolioImageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageIds, setImageIds] = useState<string[]>([]) // Track IDs of existing images
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]) // Track IDs of images marked for deletion
  const objectUrlRefs = useRef<string[]>([])
  const objectUrlIndices = useRef<Set<number>>(new Set()) // Track which indices are object URLs

  const [formData, setFormData] = useState({
    title: '',
    category: 'Residencial' as 'Residencial' | 'Comercial' | 'Mobiliario',
  })

  useEffect(() => {
    if (image) {
      setFormData({
        title: image.title || '',
        category: image.category,
      })
      setImagePreviews(image.images.map(img => img.image_path))
      setImageIds(image.images.map(img => img.id))
      // Reset object URL tracking when editing existing project
      objectUrlRefs.current = []
      objectUrlIndices.current = new Set()
      setDeletedImageIds([])
    }
  }, [image])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlRefs.current.forEach(url => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      
      // Create previews for new files
      const newPreviews = newFiles.map(file => {
        const preview = URL.createObjectURL(file)
        objectUrlRefs.current.push(preview)
        return preview
      })

      // Track the indices of new object URLs
      const startIndex = imagePreviews.length
      newPreviews.forEach((_, idx) => {
        objectUrlIndices.current.add(startIndex + idx)
      })

      // Append to existing files and previews
      setImageFiles(prev => [...prev, ...newFiles])
      setImagePreviews(prev => [...prev, ...newPreviews])
    }
  }

  const handleRemoveImage = (index: number) => {
    // Check if this is an existing image (has an ID)
    const imageId = imageIds[index]
    if (imageId) {
      // Mark existing image for deletion
      setDeletedImageIds(prev => [...prev, imageId])
    } else {
      // Only revoke if this is an object URL (newly selected file)
      if (objectUrlIndices.current.has(index)) {
        const removedUrl = imagePreviews[index]
        if (removedUrl) {
          URL.revokeObjectURL(removedUrl)
          // Remove from refs array
          const refIndex = objectUrlRefs.current.indexOf(removedUrl)
          if (refIndex > -1) {
            objectUrlRefs.current.splice(refIndex, 1)
          }
        }
        objectUrlIndices.current.delete(index)
      }
    }

    // Update state to remove the image
    setImageFiles(prev => {
      // Calculate how many new files were before this index
      const newFileCount = imagePreviews.slice(0, index).filter((_, i) => objectUrlIndices.current.has(i)).length
      return prev.filter((_, i) => i !== index - (index - newFileCount))
    })
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setImageIds(prev => prev.filter((_, i) => i !== index))
    
    // Update objectUrlIndices - shift all indices after the removed one
    const newIndices = new Set<number>()
    objectUrlIndices.current.forEach(idx => {
      if (idx < index) {
        newIndices.add(idx)
      } else if (idx > index) {
        newIndices.add(idx - 1)
      }
    })
    objectUrlIndices.current = newIndices
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (image) {
        // Update existing project
        const result = await updatePortfolioProject(image.id, formData)
        if (!result.success) {
          setError(result.error || 'Failed to update project')
          setIsSubmitting(false)
          return
        }

        // Delete marked images from backend
        for (const imageId of deletedImageIds) {
          const deleteResult = await deleteProjectImage(imageId)
          if (!deleteResult.success) {
            setError(deleteResult.error || 'Failed to delete image')
            setIsSubmitting(false)
            return
          }
        }

        // Add new images if provided
        if (imageFiles.length > 0) {
          const imageResult = await addProjectImages(image.id, imageFiles)
          if (!imageResult.success) {
            setError(imageResult.error || 'Failed to add images')
            setIsSubmitting(false)
            return
          }
        }
      } else {
        // Create new project
        if (imageFiles.length === 0) {
          setError('Al menos una imagen es obligatoria')
          setIsSubmitting(false)
          return
        }

        const result = await createPortfolioProject({
          ...formData,
          imageFiles,
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
      <div className="bg-petroleum-dark border border-cream/10 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-petroleum-dark border-b border-cream/10 p-6 flex items-center justify-between">
          <h2 className="font-serif text-xl text-cream">
            {image ? 'Editar Proyecto' : 'Nuevo Proyecto'}
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
              Imágenes {!image && '(requerido)'} {image && '(opcional para agregar más)'}
            </label>
            <div className="border-2 border-dashed border-cream/20 rounded-lg p-6 hover:border-gold/40 transition-colors duration-300">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="hidden"
                id="portfolio-image"
              />
              <label
                htmlFor="portfolio-image"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <label
                      htmlFor="portfolio-image"
                      className="relative aspect-square border-2 border-dashed border-cream/20 rounded-lg flex items-center justify-center hover:border-gold/40 transition-colors duration-300 cursor-pointer"
                    >
                      <div className="flex flex-col items-center gap-2 text-cream/40">
                        <Plus className="w-6 h-6" />
                        <span className="text-xs">Agregar más</span>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-cream/40">
                    <ImageIcon className="w-12 h-12" />
                    <span className="text-sm">Click para subir imágenes</span>
                    <span className="text-xs">PNG, JPG hasta 10MB cada una</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40 block mb-2">
              Título (opcional)
            </label>
            <input
              id="title"
              type="text"
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
              {isSubmitting ? 'Guardando...' : image ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
