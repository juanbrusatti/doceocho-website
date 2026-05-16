'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, X, Plus, Trash2, Edit2 } from 'lucide-react'
import {
  getPortfolioCategories,
  createPortfolioCategory,
  updatePortfolioCategory,
  deletePortfolioCategory,
} from '@/actions/portfolio-categories'
import type { PortfolioCategory, PortfolioCategoryFormData } from '@/types/portfolio-categories'

export default function AdminPortfolioCategories() {
  const [categories, setCategories] = useState<PortfolioCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [formData, setFormData] = useState<PortfolioCategoryFormData>({
    name: '',
  })

  useEffect(() => {
    async function fetchCategories() {
      try {
        const result = await getPortfolioCategories()
        if (result.success && result.categories) {
          setCategories(result.categories)
          setError(null)
        } else {
          setError(result.error || 'Failed to fetch categories')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setError('An error occurred while fetching categories')
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  function handleCreate() {
    setCreating(true)
    setEditingId(null)
    setFormData({ name: '' })
    setError(null)
  }

  function handleEdit(category: PortfolioCategory) {
    setEditingId(category.id)
    setCreating(false)
    setFormData({ name: category.name })
    setError(null)
  }

  function handleCancel() {
    setCreating(false)
    setEditingId(null)
    setFormData({ name: '' })
    setError(null)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)

    try {
      if (creating) {
        const result = await createPortfolioCategory(formData)
        if (result.success && result.category) {
          setCategories([...categories, result.category])
          setCreating(false)
          setFormData({ name: '' })
          setSuccess(true)
          successTimeoutRef.current = setTimeout(() => {
            setSuccess(false)
          }, 3000)
        } else {
          setError(result.error || 'Failed to create category')
        }
      } else if (editingId) {
        const result = await updatePortfolioCategory(editingId, formData)
        if (result.success && result.category) {
          setCategories(categories.map((cat) => (cat.id === editingId ? result.category : cat)))
          setEditingId(null)
          setFormData({ name: '' })
          setSuccess(true)
          successTimeoutRef.current = setTimeout(() => {
            setSuccess(false)
          }, 3000)
        } else {
          setError(result.error || 'Failed to update category')
        }
      }
    } catch (error) {
      console.error('Error saving category:', error)
      setError('An error occurred while saving category')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      const result = await deletePortfolioCategory(id)
      if (result.success) {
        setCategories(categories.filter((cat) => cat.id !== id))
        setSuccess(true)
        successTimeoutRef.current = setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } else {
        setError(result.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      setError('An error occurred while deleting category')
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
        <h2 className="font-serif text-xl text-cream">Categorías del Portfolio</h2>
        {!creating && !editingId && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300"
            aria-label="Add new category"
          >
            <Plus className="w-4 h-4" />
            Agregar
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
          <p className="text-green-400 text-sm">Operación exitosa</p>
        </div>
      )}

      {(creating || editingId) && (
        <form onSubmit={handleSave} className="mb-6 p-4 bg-petroleum-light/20 border border-cream/10 rounded-lg">
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-cream/60 text-sm mb-2">
              Nombre de la Categoría
            </label>
            <input
              id="categoryName"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-transparent border border-cream/20 rounded px-4 py-2 text-cream focus:border-gold outline-none transition-colors duration-300"
              placeholder="Ej: Residencial"
              required
              maxLength={100}
              aria-label="Category name"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Save category"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 border border-cream/20 text-cream/60 rounded hover:border-cream/40 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancel"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-cream/40 text-sm">No hay categorías creadas</p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 bg-petroleum-light/20 border border-cream/10 rounded-lg"
            >
              {editingId === category.id ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="flex-1 bg-transparent border border-cream/20 rounded px-4 py-2 text-cream focus:border-gold outline-none transition-colors duration-300"
                  placeholder="Category name"
                  required
                  maxLength={100}
                  autoFocus
                />
              ) : (
                <span className="text-cream">{category.name}</span>
              )}
              <div className="flex gap-2">
                {editingId !== category.id && (
                  <>
                    <button
                      onClick={() => handleEdit(category)}
                      disabled={creating || editingId !== null}
                      className="p-2 text-cream/60 hover:text-gold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Edit ${category.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={creating || editingId !== null}
                      className="p-2 text-cream/60 hover:text-red-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
