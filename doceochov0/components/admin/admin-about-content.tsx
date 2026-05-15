'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAboutContent, updateAboutContent } from '@/actions/about-content'
import type { AboutContent } from '@/types/about-content'
import { Save, X, Plus, Trash2, Settings as SettingsIcon, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

export default function AdminAboutContent() {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quote: '',
    stats: [{ value: '', label: '' }] as { value: string; label: string }[],
    image_path: '',
  })

  useEffect(() => {
    fetchContent()
  }, [])

  async function fetchContent() {
    setLoading(true)
    try {
      const result = await getAboutContent()
      if (result.success) {
        setContent(result.content || null)
        if (result.content) {
          setFormData({
            title: result.content.title,
            description: result.content.description,
            quote: result.content.quote,
            stats: result.content.stats,
            image_path: result.content.image_path,
          })
        }
      } else {
        setError(result.error || 'Failed to fetch About content')
      }
    } catch (error) {
      console.error('Error fetching About content:', error)
      setError('An error occurred while fetching About content')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    try {
      const result = await updateAboutContent({
        ...formData,
        imageFile: imageFile || undefined,
      })
      if (result.success) {
        setContent(result.content || null)
        setEditing(false)
        setImageFile(null)
        setImagePreview('')
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error || 'Failed to update About content')
      }
    } catch (error) {
      console.error('Error updating About content:', error)
      setError('An error occurred while updating About content')
    }
  }

  function handleCancel() {
    setEditing(false)
    if (content) {
      setFormData({
        title: content.title,
        description: content.description,
        quote: content.quote,
        stats: content.stats,
        image_path: content.image_path,
      })
    }
    setError(null)
    setImageFile(null)
    setImagePreview('')
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const preview = URL.createObjectURL(file)
      setImagePreview(preview)
    }
  }

  function addStat() {
    setFormData({
      ...formData,
      stats: [...formData.stats, { value: '', label: '' }],
    })
  }

  function removeStat(index: number) {
    setFormData({
      ...formData,
      stats: formData.stats.filter((_, i) => i !== index),
    })
  }

  function updateStat(index: number, field: 'value' | 'label', value: string) {
    const newStats = [...formData.stats]
    newStats[index][field] = value
    setFormData({ ...formData, stats: newStats })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light text-cream">About / Estudio</h2>
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
                  <label className="block text-cream/60 text-sm mb-2">Título</label>
                  <p className="text-cream font-mono">{content.title}</p>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Descripción</label>
                  <p className="text-cream font-mono text-sm">{content.description}</p>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Cita</label>
                  <p className="text-cream font-mono italic">"{content.quote}"</p>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Estadísticas</label>
                  <div className="space-y-2">
                    {content.stats.map((stat, index) => (
                      <div key={index} className="flex gap-4">
                        <span className="text-cream font-mono">{stat.value}</span>
                        <span className="text-cream font-mono">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Imagen del Estudio</label>
                  <div className="relative aspect-video w-48 bg-petroleum-dark/50 border border-cream/20 rounded-lg overflow-hidden">
                    <Image
                      src={content.image_path}
                      alt="Studio image"
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
                Editar contenido
              </button>
            </div>
          )}

          {editing && (
            <div className="bg-petroleum-light/30 border border-gold/30 rounded-lg p-6">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-cream/60 text-sm mb-2">Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Ej: Creamos espacios que trascienden la tendencia."
                  />
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors min-h-[150px]"
                    placeholder="Ej: Doce Ocho nació de la convicción de que un espacio bien resuelto..."
                  />
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Cita</label>
                  <input
                    type="text"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Ej: Lo que no se ve es lo que sostiene todo lo demás"
                  />
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Estadísticas</label>
                  <div className="space-y-3">
                    {formData.stats.map((stat, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => updateStat(index, 'value', e.target.value)}
                          className="flex-1 px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                          placeholder="Ej: 12+"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => updateStat(index, 'label', e.target.value)}
                          className="flex-1 px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                          placeholder="Ej: Años de experiencia"
                        />
                        {formData.stats.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStat(index)}
                            className="px-3 py-2 border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addStat}
                      className="flex items-center gap-2 px-4 py-2 border border-cream/20 text-cream/60 rounded hover:border-cream/40 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar estadística
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Imagen del Estudio</label>
                  <div className="space-y-3">
                    <div className="relative aspect-video w-48 bg-petroleum-dark/50 border border-cream/20 rounded-lg overflow-hidden">
                      {imagePreview || formData.image_path ? (
                        <Image
                          src={imagePreview || formData.image_path}
                          alt="Preview"
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
                      onChange={handleFileSelect}
                      className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-gold file:text-petroleum-dark file:cursor-pointer"
                    />
                    <p className="text-cream/40 text-xs">Formatos: JPG, PNG, WEBP. Máximo 5MB</p>
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
