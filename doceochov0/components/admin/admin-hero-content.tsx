'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getHeroContent, updateHeroContent } from '@/actions/hero-content'
import type { HeroContent } from '@/types/hero-content'
import { Save, X, Settings as SettingsIcon } from 'lucide-react'

export default function AdminHeroContent() {
  const [content, setContent] = useState<HeroContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    headline: '',
    headline_secondary: '',
    subtitle: '',
    cta_text: '',
    cta_secondary_text: '',
    image_path: '',
  })

  useEffect(() => {
    fetchContent()
  }, [])

  async function fetchContent() {
    setLoading(true)
    try {
      const result = await getHeroContent()
      if (result.success) {
        setContent(result.content || null)
        if (result.content) {
          setFormData({
            headline: result.content.headline,
            headline_secondary: result.content.headline_secondary,
            subtitle: result.content.subtitle,
            cta_text: result.content.cta_text,
            cta_secondary_text: result.content.cta_secondary_text,
            image_path: result.content.image_path,
          })
        }
      } else {
        setError(result.error || 'Failed to fetch hero content')
      }
    } catch (error) {
      console.error('Error fetching hero content:', error)
      setError('An error occurred while fetching hero content')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    try {
      const result = await updateHeroContent(formData)
      if (result.success) {
        setContent(result.content || null)
        setEditing(false)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error || 'Failed to update hero content')
      }
    } catch (error) {
      console.error('Error updating hero content:', error)
      setError('An error occurred while updating hero content')
    }
  }

  function handleCancel() {
    setEditing(false)
    if (content) {
      setFormData({
        headline: content.headline,
        headline_secondary: content.headline_secondary,
        subtitle: content.subtitle,
        cta_text: content.cta_text,
        cta_secondary_text: content.cta_secondary_text,
        image_path: content.image_path,
      })
    }
    setError(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light text-cream">Hero Section</h2>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold text-sm"
          >
            ✓ Guardado exitosamente
          </motion.div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error && !content ? (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-200">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {!editing && content && (
            <div className="bg-petroleum-light/30 border border-cream/10 rounded-lg p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-cream/60 text-sm mb-2">Título principal</label>
                  <p className="text-cream font-mono">{content.headline}</p>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Título secundario (italic)</label>
                  <p className="text-cream font-mono">{content.headline_secondary}</p>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Subtítulo</label>
                  <p className="text-cream font-mono">{content.subtitle}</p>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Texto del botón principal (WhatsApp)</label>
                  <p className="text-cream font-mono">{content.cta_text}</p>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Texto del botón de scroll</label>
                  <p className="text-cream font-mono">{content.cta_secondary_text}</p>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Ruta de la imagen</label>
                  <p className="text-cream font-mono">{content.image_path}</p>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="mt-6 flex items-center gap-2 px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300"
              >
                <SettingsIcon className="w-4 h-4" />
                Editar contenido
              </button>
            </div>
          )}

          {editing && (
            <div className="bg-petroleum-light/30 border border-gold/30 rounded-lg p-6">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-cream/60 text-sm mb-2">Título principal</label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Ej: Donde el diseño"
                  />
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Título secundario (italic)</label>
                  <input
                    type="text"
                    value={formData.headline_secondary}
                    onChange={(e) => setFormData({ ...formData, headline_secondary: e.target.value })}
                    className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Ej: y la materia se encuentra"
                  />
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Subtítulo</label>
                  <textarea
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors min-h-[100px]"
                    placeholder="Ej: Arquitectura interior y mobiliario a medida. Proyectos completos. Detalles que definen."
                  />
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Texto del botón principal (WhatsApp)</label>
                  <input
                    type="text"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Ej: Consultar proyecto"
                  />
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Texto del botón de scroll</label>
                  <input
                    type="text"
                    value={formData.cta_secondary_text}
                    onChange={(e) => setFormData({ ...formData, cta_secondary_text: e.target.value })}
                    className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Ej: Ver proyectos"
                  />
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Ruta de la imagen</label>
                  <input
                    type="text"
                    value={formData.image_path}
                    onChange={(e) => setFormData({ ...formData, image_path: e.target.value })}
                    className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Ej: /images/hero-interior.jpg"
                  />
                  <p className="text-cream/40 text-xs mt-1">La imagen debe estar en la carpeta public/images</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300"
                  >
                    <Save className="w-4 h-4" />
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 border border-cream/20 text-cream/60 rounded hover:border-cream/40 transition-colors duration-300"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
