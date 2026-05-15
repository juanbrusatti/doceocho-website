'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getSEOMetadata, updateSEOMetadata } from '@/actions/seo-metadata'
import type { SEOMetadata } from '@/types/seo-metadata'
import { Save, X, Settings as SettingsIcon, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

export default function AdminSEOMetadata() {
  const [metadata, setMetadata] = useState<SEOMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [ogImageFile, setOgImageFile] = useState<File | null>(null)
  const [ogImagePreview, setOgImagePreview] = useState<string>('')
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string>('')

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
      const result = await updateSEOMetadata({
        ...formData,
        ogImageFile: ogImageFile || undefined,
        faviconFile: faviconFile || undefined,
      })
      if (result.success) {
        setMetadata(result.metadata || null)
        setEditing(false)
        setOgImageFile(null)
        setOgImagePreview('')
        setFaviconFile(null)
        setFaviconPreview('')
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
    setOgImageFile(null)
    setOgImagePreview('')
    setFaviconFile(null)
    setFaviconPreview('')
  }

  function handleOgImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setOgImageFile(file)
      const preview = URL.createObjectURL(file)
      setOgImagePreview(preview)
    }
  }

  function handleFaviconSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setFaviconFile(file)
      const preview = URL.createObjectURL(file)
      setFaviconPreview(preview)
    }
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
                    <div className="relative aspect-video w-48 bg-petroleum-dark/50 border border-cream/20 rounded-lg overflow-hidden">
                      <Image
                        src={metadata.og_image}
                        alt="OG Image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Favicon</label>
                  <div className="relative aspect-square w-16 bg-petroleum-dark/50 border border-cream/20 rounded-lg overflow-hidden">
                    <Image
                      src={metadata.favicon}
                      alt="Favicon"
                      fill
                      className="object-cover"
                    />
                  </div>
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
                    <div className="space-y-3">
                      <div className="relative aspect-video w-48 bg-petroleum-dark/50 border border-cream/20 rounded-lg overflow-hidden">
                        {ogImagePreview || formData.og_image ? (
                          <Image
                            src={ogImagePreview || formData.og_image}
                            alt="OG Image preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageIcon className="w-6 h-6 text-cream/30" />
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleOgImageSelect}
                        className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-gold file:text-petroleum-dark file:cursor-pointer"
                      />
                      <p className="text-cream/40 text-xs">Imagen de 1200x630px recomendada. Máximo 5MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Favicon</label>
                  <div className="space-y-3">
                    <div className="relative aspect-square w-16 bg-petroleum-dark/50 border border-cream/20 rounded-lg overflow-hidden">
                      {faviconPreview || formData.favicon ? (
                        <Image
                          src={faviconPreview || formData.favicon}
                          alt="Favicon preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="w-4 h-4 text-cream/30" />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconSelect}
                      className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-gold file:text-petroleum-dark file:cursor-pointer"
                    />
                    <p className="text-cream/40 text-xs">Archivo .ico o .png de 32x32px. Máximo 5MB</p>
                  </div>
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
