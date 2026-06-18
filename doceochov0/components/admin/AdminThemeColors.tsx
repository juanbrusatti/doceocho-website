'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, X, Palette } from 'lucide-react'
import { getThemeColors, updateThemeColors } from '@/actions/theme-colors'
import type { ThemeColors, ThemeColorsFormData } from '@/types/theme-colors'

export default function AdminThemeColors() {
  const [colors, setColors] = useState<ThemeColors | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [formData, setFormData] = useState<ThemeColorsFormData>({
    gold: '',
    cream: '',
    petroleum_dark: '',
    petroleum_light: '',
  })

  useEffect(() => {
    async function fetchColors() {
      try {
        const result = await getThemeColors()
        if (result.success && result.colors) {
          setColors(result.colors)
          setFormData({
            gold: result.colors.gold,
            cream: result.colors.cream,
            petroleum_dark: result.colors.petroleum_dark,
            petroleum_light: result.colors.petroleum_light,
          })
          setError(null)
        } else {
          setError(result.error || 'Failed to fetch theme colors')
        }
      } catch (error) {
        console.error('Error fetching theme colors:', error)
        setError('An error occurred while fetching theme colors')
      } finally {
        setLoading(false)
      }
    }
    fetchColors()
  }, [])

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  function handleEdit() {
    setEditing(true)
    setError(null)
  }

  function handleCancel() {
    setEditing(false)
    if (colors) {
      setFormData({
        gold: colors.gold,
        cream: colors.cream,
        petroleum_dark: colors.petroleum_dark,
        petroleum_light: colors.petroleum_light,
      })
    }
    setError(null)
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)

    try {
      const result = await updateThemeColors(formData)
      if (result.success && result.colors) {
        setColors(result.colors)
        // Save to localStorage for instant loading
        localStorage.setItem('theme-colors', JSON.stringify(result.colors))
        setEditing(false)
        setSuccess(true)
        successTimeoutRef.current = setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } else {
        setError(result.error || 'Failed to update theme colors')
      }
    } catch (error) {
      console.error('Error updating theme colors:', error)
      setError('An error occurred while updating theme colors')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-petroleum-dark border border-cream/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-cream">Colores del Tema</h2>
        {!editing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300"
            aria-label="Edit theme colors"
          >
            <Save className="w-4 h-4" />
            Editar
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4" role="alert">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4" role="status">
          <p className="text-green-400 text-sm">Colores actualizados exitosamente</p>
        </div>
      )}

      {editing ? (
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label htmlFor="gold" className="block text-cream/60 text-sm mb-2">
              Gold (Dorado)
            </label>
            <div className="flex gap-4">
              <input
                id="gold"
                type="color"
                value={formData.gold}
                onChange={(e) => setFormData({ ...formData, gold: e.target.value })}
                className="w-16 h-16 rounded cursor-pointer border-0"
                aria-label="Choose gold color"
              />
              <input
                type="text"
                value={formData.gold}
                onChange={(e) => setFormData({ ...formData, gold: e.target.value })}
                className="flex-1 bg-transparent border border-cream/20 rounded px-4 py-2 text-cream focus:border-gold outline-none transition-colors duration-300"
                placeholder="#D4AF37"
                pattern="^#[0-9A-Fa-f]{6}$"
                aria-label="Gold color hex value"
              />
            </div>
          </div>

          <div>
            <label htmlFor="cream" className="block text-cream/60 text-sm mb-2">
              Cream (Crema)
            </label>
            <div className="flex gap-4">
              <input
                id="cream"
                type="color"
                value={formData.cream}
                onChange={(e) => setFormData({ ...formData, cream: e.target.value })}
                className="w-16 h-16 rounded cursor-pointer border-0"
                aria-label="Choose cream color"
              />
              <input
                type="text"
                value={formData.cream}
                onChange={(e) => setFormData({ ...formData, cream: e.target.value })}
                className="flex-1 bg-transparent border border-cream/20 rounded px-4 py-2 text-cream focus:border-gold outline-none transition-colors duration-300"
                placeholder="#F5F5DC"
                pattern="^#[0-9A-Fa-f]{6}$"
                aria-label="Cream color hex value"
              />
            </div>
          </div>

          <div>
            <label htmlFor="petroleum_dark" className="block text-cream/60 text-sm mb-2">
              Petroleum Dark (Oscuro)
            </label>
            <div className="flex gap-4">
              <input
                id="petroleum_dark"
                type="color"
                value={formData.petroleum_dark}
                onChange={(e) => setFormData({ ...formData, petroleum_dark: e.target.value })}
                className="w-16 h-16 rounded cursor-pointer border-0"
                aria-label="Choose petroleum dark color"
              />
              <input
                type="text"
                value={formData.petroleum_dark}
                onChange={(e) => setFormData({ ...formData, petroleum_dark: e.target.value })}
                className="flex-1 bg-transparent border border-cream/20 rounded px-4 py-2 text-cream focus:border-gold outline-none transition-colors duration-300"
                placeholder="#1A1A2E"
                pattern="^#[0-9A-Fa-f]{6}$"
                aria-label="Petroleum dark color hex value"
              />
            </div>
          </div>

          <div>
            <label htmlFor="petroleum_light" className="block text-cream/60 text-sm mb-2">
              Petroleum Light (Claro)
            </label>
            <div className="flex gap-4">
              <input
                id="petroleum_light"
                type="color"
                value={formData.petroleum_light}
                onChange={(e) => setFormData({ ...formData, petroleum_light: e.target.value })}
                className="w-16 h-16 rounded cursor-pointer border-0"
                aria-label="Choose petroleum light color"
              />
              <input
                type="text"
                value={formData.petroleum_light}
                onChange={(e) => setFormData({ ...formData, petroleum_light: e.target.value })}
                className="flex-1 bg-transparent border border-cream/20 rounded px-4 py-2 text-cream focus:border-gold outline-none transition-colors duration-300"
                placeholder="#2D2D44"
                pattern="^#[0-9A-Fa-f]{6}$"
                aria-label="Petroleum light color hex value"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Save theme colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 border border-cream/20 text-cream/60 rounded hover:border-cream/40 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 bg-petroleum-light/20 border border-cream/10 rounded-lg">
            <div
              className="w-16 h-16 rounded border border-cream/20"
              style={{ backgroundColor: colors?.gold }}
              aria-hidden="true"
            />
            <div>
              <p className="text-cream font-medium">Gold</p>
              <p className="text-cream/60 text-sm">{colors?.gold}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-petroleum-light/20 border border-cream/10 rounded-lg">
            <div
              className="w-16 h-16 rounded border border-cream/20"
              style={{ backgroundColor: colors?.cream }}
              aria-hidden="true"
            />
            <div>
              <p className="text-cream font-medium">Cream</p>
              <p className="text-cream/60 text-sm">{colors?.cream}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-petroleum-light/20 border border-cream/10 rounded-lg">
            <div
              className="w-16 h-16 rounded border border-cream/20"
              style={{ backgroundColor: colors?.petroleum_dark }}
              aria-hidden="true"
            />
            <div>
              <p className="text-cream font-medium">Petroleum Dark</p>
              <p className="text-cream/60 text-sm">{colors?.petroleum_dark}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-petroleum-light/20 border border-cream/10 rounded-lg">
            <div
              className="w-16 h-16 rounded border border-cream/20"
              style={{ backgroundColor: colors?.petroleum_light }}
              aria-hidden="true"
            />
            <div>
              <p className="text-cream font-medium">Petroleum Light</p>
              <p className="text-cream/60 text-sm">{colors?.petroleum_light}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
