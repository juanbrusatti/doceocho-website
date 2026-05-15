'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getSEOMetadata, updateSEOMetadata } from '@/actions/seo-metadata'
import type { SEOMetadata } from '@/types/seo-metadata'
import { Save, X, Settings as SettingsIcon } from 'lucide-react'

export default function AdminSEOMetadata() {
  const [metadata, setMetadata] = useState<SEOMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    og_title: '',
    og_description: '',
    og_image: '',
    favicon: '',
  })

  useEffect(() => {
    fetchMetadata()
  }, [])

  async function fetchMetadata() {
    setLoading(true)
    try {
      const result = await getSEOMetadata()
      if (result.success) {
        setMetadata(result.metadata || null)
        if (result.metadata) {
          setFormData({
            title: result.metadata.title,
            description: result.metadata.description,
            og_title: result.metadata.og_title,
            og_description: result.metadata.og_description,
            og_image: result.metadata.og_image,
            favicon: result.metadata.favicon,
          })
        }
      } else {
        setError(result.error || 'Failed to fetch SEO metadata')
      }
    } catch (error) {
      console.error('Error fetching SEO metadata:', error)
      setError('An error occurred while fetching SEO metadata')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    try {
      const result = await updateSEOMetadata(formData)
      if (result.success) {
        setMetadata(result.metadata || null)
        setEditing(false)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error || 'Failed to update SEO metadata')
      }
    } catch (error) {
      console.error('Error updating SEO metadata:', error)
      setError('An error occurred while updating SEO metadata')
    }
  }

  function handleCancel() {
    setEditing(false)
    if (metadata) {
      setFormData({
        title: metadata.title,
        description: metadata.description,
        og_title: metadata.og_title,
        og_description: metadata.og_description,
        og_image: metadata.og_image,
        favicon: metadata.favicon,
      })
    }
    setError(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light text-cream">SEO / Metadata</h2>
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
      ) : error && !metadata ? (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-200">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {!editing && metadata && (
            <div className="bg-petroleum-light/30 border border-cream/10 rounded-lg p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-cream/60 text-sm mb-2">Título de la página</label>
                  <p className="text-cream font-mono">{metadata.title}</p>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Descripción meta</label>
                  <p className="text-cream font-mono text-sm">{metadata.description}</p>
                </div>

                <div className="border-t border-cream/10 pt-6">
                  <h3 className="text-gold font-serif text-lg mb-4">Open Graph (Redes Sociales)</h3>
                  
                  <div className="mb-4">
                    <label className="block text-cream/60 text-sm mb-2">OG Title</label>
                    <p className="text-cream font-mono">{metadata.og_title}</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-cream/60 text-sm mb-2">OG Description</label>
                    <p className="text-cream font-mono text-sm">{metadata.og_description}</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-cream/60 text-sm mb-2">OG Image</label>
                    <p className="text-cream font-mono">{metadata.og_image}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Favicon</label>
                  <p className="text-cream font-mono">{metadata.favicon}</p>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="mt-6 flex items-center gap-2 px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300"
              >
                <SettingsIcon className="w-4 h-4" />
                Editar metadata
              </button>
            </div>
          )}

          {editing && (
            <div className="bg-petroleum-light/30 border border-gold/30 rounded-lg p-6">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-cream/60 text-sm mb-2">Título de la página</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Ej: DoceOcho Estudio | Arquitectura Interior"
                  />
                  <p className="text-cream/40 text-xs mt-1">Máximo 60 caracteres recomendado</p>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Descripción meta</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors min-h-[100px]"
                    placeholder="Ej: Estudio de arquitectura interior y mobiliario a medida en Córdoba, Argentina."
                  />
                  <p className="text-cream/40 text-xs mt-1">Máximo 160 caracteres recomendado</p>
                </div>

                <div className="border-t border-cream/10 pt-6">
                  <h3 className="text-gold font-serif text-lg mb-4">Open Graph (Redes Sociales)</h3>
                  
                  <div className="mb-4">
                    <label className="block text-cream/60 text-sm mb-2">OG Title</label>
                    <input
                      type="text"
                      value={formData.og_title}
                      onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                      className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                      placeholder="Ej: DoceOcho Estudio | Arquitectura Interior Premium"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-cream/60 text-sm mb-2">OG Description</label>
                    <textarea
                      value={formData.og_description}
                      onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                      className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors min-h-[100px]"
                      placeholder="Ej: Donde el diseño y la materia se encuentran."
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-cream/60 text-sm mb-2">OG Image</label>
                    <input
                      type="text"
                      value={formData.og_image}
                      onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                      className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                      placeholder="Ej: /images/og-image.jpg"
                    />
                    <p className="text-cream/40 text-xs mt-1">Imagen de 1200x630px recomendada</p>
                  </div>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Favicon</label>
                  <input
                    type="text"
                    value={formData.favicon}
                    onChange={(e) => setFormData({ ...formData, favicon: e.target.value })}
                    className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Ej: /favicon.ico"
                  />
                  <p className="text-cream/40 text-xs mt-1">Archivo .ico o .png de 32x32px</p>
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
