'use client'

import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, Check, X } from 'lucide-react'
import { getSiteConfig, updateSiteConfig } from '@/actions/site-config'
import type { SiteConfig } from '@/types/site-config'

export default function AdminSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    whatsapp_number: '',
    email: '',
    instagram_url: '',
    studio_name: '',
    footer_tagline: '',
    specialties: [] as string[],
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  async function fetchConfig() {
    setLoading(true)
    try {
      const result = await getSiteConfig()
      if (result.success) {
        setConfig(result.config || null)
        if (result.config) {
          setFormData({
            whatsapp_number: result.config.whatsapp_number,
            email: result.config.email,
            instagram_url: result.config.instagram_url,
            studio_name: result.config.studio_name,
            footer_tagline: result.config.footer_tagline,
            specialties: result.config.specialties,
          })
        }
      } else {
        setError(result.error || 'Failed to fetch configuration')
      }
    } catch (error) {
      console.error('Error fetching configuration:', error)
      setError('An error occurred while fetching configuration')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setSuccess(false)
    setError(null)

    const result = await updateSiteConfig(formData)
    if (result.success) {
      setConfig(result.config || null)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error || 'Failed to update configuration')
    }
  }

  function handleCancel() {
    setEditing(false)
    if (config) {
      setFormData({
        whatsapp_number: config.whatsapp_number,
        email: config.email,
        instagram_url: config.instagram_url,
        studio_name: config.studio_name,
        footer_tagline: config.footer_tagline,
        specialties: config.specialties,
      })
    }
    setError(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light text-cream">Configuración General</h2>
        {success && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <Check className="w-4 h-4" />
            Guardado exitosamente
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-cream/50">Cargando...</div>
      ) : editing ? (
        <div className="bg-petroleum-light/30 border border-gold/30 rounded-lg p-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-cream/60 text-sm mb-2">Número de WhatsApp</label>
              <input
                type="text"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Ej: 5493584178955"
              />
              <p className="text-cream/40 text-xs mt-1">Solo el número sin formato (+54 9 358...)</p>
            </div>

            <div>
              <label className="block text-cream/60 text-sm mb-2">Email de contacto</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Ej: doce8.estudio@gmail.com"
              />
            </div>

            <div>
              <label className="block text-cream/60 text-sm mb-2">URL de Instagram</label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Ej: https://instagram.com/doce8.estudio"
              />
            </div>

            <div className="border-t border-cream/10 pt-6">
              <h3 className="text-gold font-serif text-lg mb-4">Footer</h3>
              
              <div className="mb-4">
                <label className="block text-cream/60 text-sm mb-2">Nombre del estudio</label>
                <input
                  type="text"
                  value={formData.studio_name}
                  onChange={(e) => setFormData({ ...formData, studio_name: e.target.value })}
                  className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="Ej: DoceOcho Estudio"
                />
              </div>

              <div className="mb-4">
                <label className="block text-cream/60 text-sm mb-2">Frase del footer</label>
                <input
                  type="text"
                  value={formData.footer_tagline}
                  onChange={(e) => setFormData({ ...formData, footer_tagline: e.target.value })}
                  className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder='Ej: "Diseño en conjunto. Córdoba, Argentina."'
                />
              </div>

              <div>
                <label className="block text-cream/60 text-sm mb-2">Especialidades (una por línea)</label>
                <textarea
                  value={formData.specialties.join('\n')}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value.split('\n').filter(s => s.trim()) })}
                  className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors min-h-[120px]"
                  placeholder="Ej: Arquitectura residencial&#10;Arquitectura comercial&#10;Cocinas a medida"
                />
                <p className="text-cream/40 text-xs mt-1">Escribe cada especialidad en una línea nueva</p>
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
      ) : config ? (
        <div className="space-y-6">
          <div className="bg-petroleum-light/30 border border-cream/10 rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-cream/60 text-sm mb-2">Número de WhatsApp</label>
                <p className="text-cream font-mono">{config.whatsapp_number}</p>
              </div>

              <div>
                <label className="block text-cream/60 text-sm mb-2">Email de contacto</label>
                <p className="text-cream font-mono">{config.email}</p>
              </div>

              <div>
                <label className="block text-cream/60 text-sm mb-2">URL de Instagram</label>
                <p className="text-cream font-mono">{config.instagram_url}</p>
              </div>

              <div className="border-t border-cream/10 pt-6">
                <h3 className="text-gold font-serif text-lg mb-4">Footer</h3>
                
                <div className="mb-4">
                  <label className="block text-cream/60 text-sm mb-2">Nombre del estudio</label>
                  <p className="text-cream font-mono">{config.studio_name}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-cream/60 text-sm mb-2">Frase del footer</label>
                  <p className="text-cream font-mono">"{config.footer_tagline}"</p>
                </div>

                <div>
                  <label className="block text-cream/60 text-sm mb-2">Especialidades</label>
                  <ul className="text-cream font-mono">
                    {config.specialties.map((specialty, index) => (
                      <li key={index} className="py-1">{specialty}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300"
            >
              <SettingsIcon className="w-4 h-4" />
              Editar configuración
            </button>
          </div>

          <div className="bg-petroleum-light/10 border border-cream/5 rounded-lg p-6">
            <h3 className="font-serif text-cream text-lg mb-4">Información</h3>
            <ul className="space-y-2 text-cream/60 text-sm">
              <li>• Estos valores se utilizan en los botones de contacto del sitio</li>
              <li>• El número de WhatsApp debe incluir código de país sin + ni espacios</li>
              <li>• La URL de Instagram debe incluir el protocolo https://</li>
              <li>• Los cambios se reflejan inmediatamente en el sitio público</li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
