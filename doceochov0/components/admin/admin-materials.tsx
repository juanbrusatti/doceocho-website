'use client'

import { useState, useEffect } from 'react'
import { X, Plus, GripVertical, Image as ImageIcon } from 'lucide-react'
import {
  getMaterialsContent,
  getMaterialQualities,
  updateMaterialsContent,
  createMaterialQuality,
  updateMaterialQuality,
  deleteMaterialQuality,
  reorderMaterialQualities,
} from '@/actions/materials'
import type { MaterialsContent, MaterialQuality } from '@/types/materials'

export default function AdminMaterials() {
  const [content, setContent] = useState<MaterialsContent | null>(null)
  const [qualities, setQualities] = useState<MaterialQuality[]>([])
  const [loading, setLoading] = useState(true)
  const [editingContent, setEditingContent] = useState(false)
  const [editingQuality, setEditingQuality] = useState<MaterialQuality | null>(null)
  const [isCreatingQuality, setIsCreatingQuality] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [contentResult, qualitiesResult] = await Promise.all([
        getMaterialsContent(),
        getMaterialQualities(),
      ])
      if (contentResult.success) {
        setContent(contentResult.content || null)
      } else {
        setError(contentResult.error || 'Failed to fetch materials content')
      }
      if (qualitiesResult.success) {
        setQualities(qualitiesResult.qualities)
      } else {
        setError(qualitiesResult.error || 'Failed to fetch material qualities')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('An error occurred while fetching data')
    } finally {
      setLoading(false)
    }
  }

  async function handleContentUpdate(formData: {
    title: string
    description: string
    quote: string
    image_path: string
  }) {
    const result = await updateMaterialsContent(formData)
    if (result.success) {
      setContent(result.content || null)
      setEditingContent(false)
      setError(null)
    } else {
      setError(result.error || 'Failed to update content')
    }
  }

  async function handleQualityCreate(formData: { label: string; description: string }) {
    const maxOrder = qualities.length > 0 ? Math.max(...qualities.map(q => q.order_index)) : -1
    const result = await createMaterialQuality({
      label: formData.label,
      description: formData.description,
      order_index: maxOrder + 1,
    })
    
    if (result.success) {
      await fetchData()
      setIsCreatingQuality(false)
      setError(null)
    } else {
      setError(result.error || 'Failed to create quality')
    }
  }

  async function handleQualityUpdate(id: string, formData: { label: string; description: string }) {
    const quality = qualities.find(q => q.id === id)
    if (!quality) return

    const result = await updateMaterialQuality({
      id,
      label: formData.label,
      description: formData.description,
      order_index: quality.order_index,
    })
    
    if (result.success) {
      await fetchData()
      setEditingQuality(null)
      setError(null)
    } else {
      setError(result.error || 'Failed to update quality')
    }
  }

  async function handleQualityDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta característica?')) return
    
    const result = await deleteMaterialQuality(id)
    if (result.success) {
      await fetchData()
      setError(null)
    } else {
      setError(result.error || 'Failed to delete quality')
    }
  }

  async function handleQualityReorder(qualityId: string, direction: 'up' | 'down') {
    const currentIndex = qualities.findIndex(q => q.id === qualityId)
    if (currentIndex === -1) return

    const newQualities = [...qualities]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= newQualities.length) return

    const temp = newQualities[currentIndex].order_index
    newQualities[currentIndex].order_index = newQualities[targetIndex].order_index
    newQualities[targetIndex].order_index = temp

    const [movedQuality] = newQualities.splice(currentIndex, 1)
    newQualities.splice(targetIndex, 0, movedQuality)

    setQualities(newQualities)

    const result = await reorderMaterialQualities(newQualities.map(q => q.id))
    if (!result.success) {
      setError(result.error || 'Failed to reorder qualities')
      await fetchData()
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light text-cream">Materiales</h2>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-cream/50">Cargando...</div>
      ) : (
        <>
          {/* Main Content */}
          <div className="bg-petroleum-light/30 border border-cream/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl text-cream">Contenido Principal</h3>
              <button
                onClick={() => setEditingContent(!editingContent)}
                className="px-4 py-2 border border-cream/20 text-cream/60 rounded hover:border-cream/40 transition-colors duration-300"
              >
                {editingContent ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            {editingContent && content ? (
              <ContentForm
                initialTitle={content.title}
                initialDescription={content.description}
                initialQuote={content.quote}
                initialImagePath={content.image_path}
                onSubmit={handleContentUpdate}
                onCancel={() => setEditingContent(false)}
              />
            ) : content ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-cream/60 text-sm mb-2">Título</label>
                  <p className="text-cream">{content.title}</p>
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-2">Descripción</label>
                  <p className="text-cream/70">{content.description}</p>
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-2">Cita</label>
                  <p className="text-cream italic">&ldquo;{content.quote}&rdquo;</p>
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-2">Imagen</label>
                  <p className="text-cream/70 text-sm">{content.image_path}</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Qualities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-cream">Características</h3>
              <button
                onClick={() => setIsCreatingQuality(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300"
              >
                <Plus className="w-4 h-4" />
                Agregar característica
              </button>
            </div>

            {qualities.map((quality, index) => (
              <div key={quality.id} className="bg-petroleum-light/30 border border-cream/10 rounded-lg p-6">
                {editingQuality?.id === quality.id ? (
                  <QualityForm
                    initialLabel={quality.label}
                    initialDescription={quality.description}
                    onSubmit={(formData) => handleQualityUpdate(quality.id, formData)}
                    onCancel={() => setEditingQuality(null)}
                    submitLabel="Guardar cambios"
                  />
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col gap-1 pt-1">
                        <button
                          onClick={() => handleQualityReorder(quality.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-cream/30 hover:text-cream disabled:opacity-30 transition-colors"
                        >
                          ↑
                        </button>
                        <GripVertical className="w-5 h-5 text-cream/30" />
                        <button
                          onClick={() => handleQualityReorder(quality.id, 'down')}
                          disabled={index === qualities.length - 1}
                          className="p-1 text-cream/30 hover:text-cream disabled:opacity-30 transition-colors"
                        >
                          ↓
                        </button>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-sans text-gold text-[9px] tracking-widest">
                            0{index + 1}
                          </span>
                          <h4 className="font-serif text-cream text-lg font-light">{quality.label}</h4>
                        </div>
                        <p className="font-sans font-light text-cream/60 text-sm leading-relaxed">
                          {quality.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingQuality(quality)}
                        className="p-2 text-cream/60 hover:text-gold transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleQualityDelete(quality.id)}
                        className="p-2 text-cream/60 hover:text-red-400 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isCreatingQuality && (
              <div className="bg-petroleum-light/30 border border-gold/30 rounded-lg p-6">
                <QualityForm
                  initialLabel=""
                  initialDescription=""
                  onSubmit={handleQualityCreate}
                  onCancel={() => setIsCreatingQuality(false)}
                  submitLabel="Crear característica"
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

interface ContentFormProps {
  initialTitle: string
  initialDescription: string
  initialQuote: string
  initialImagePath: string
  onSubmit: (formData: { title: string; description: string; quote: string; image_path: string }) => void
  onCancel: () => void
}

function ContentForm({ initialTitle, initialDescription, initialQuote, initialImagePath, onSubmit, onCancel }: ContentFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [quote, setQuote] = useState(initialQuote)
  const [imagePath, setImagePath] = useState(initialImagePath)
  const [validationError, setValidationError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !quote.trim() || !imagePath.trim()) {
      setValidationError('Todos los campos son obligatorios')
      return
    }
    setValidationError(null)
    onSubmit({ title: title.trim(), description: description.trim(), quote: quote.trim(), image_path: imagePath.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {validationError && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded text-sm">
          {validationError}
        </div>
      )}
      <div>
        <label className="block text-cream/60 text-sm mb-2">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>
      <div>
        <label className="block text-cream/60 text-sm mb-2">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
        />
      </div>
      <div>
        <label className="block text-cream/60 text-sm mb-2">Cita</label>
        <input
          type="text"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>
      <div>
        <label className="block text-cream/60 text-sm mb-2">Ruta de imagen</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            className="flex-1 px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
          />
          <div className="p-2 text-cream/30">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300"
        >
          Guardar cambios
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-cream/20 text-cream/60 rounded hover:border-cream/40 transition-colors duration-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

interface QualityFormProps {
  initialLabel: string
  initialDescription: string
  onSubmit: (formData: { label: string; description: string }) => void
  onCancel: () => void
  submitLabel: string
}

function QualityForm({ initialLabel, initialDescription, onSubmit, onCancel, submitLabel }: QualityFormProps) {
  const [label, setLabel] = useState(initialLabel)
  const [description, setDescription] = useState(initialDescription)
  const [validationError, setValidationError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!label.trim() || !description.trim()) {
      setValidationError('El label y la descripción son obligatorios')
      return
    }
    setValidationError(null)
    onSubmit({ label: label.trim(), description: description.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {validationError && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded text-sm">
          {validationError}
        </div>
      )}
      <div>
        <label className="block text-cream/60 text-sm mb-2">Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="Ej: Selección de materiales"
        />
      </div>
      <div>
        <label className="block text-cream/60 text-sm mb-2">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
          placeholder="Describe la característica..."
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-cream/20 text-cream/60 rounded hover:border-cream/40 transition-colors duration-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
