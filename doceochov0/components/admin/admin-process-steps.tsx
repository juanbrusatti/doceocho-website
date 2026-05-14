'use client'

import { useState, useEffect } from 'react'
import { X, Plus, GripVertical } from 'lucide-react'
import { getProcessSteps, createProcessStep, updateProcessStep, deleteProcessStep, reorderProcessSteps } from '@/actions/process-steps'
import type { ProcessStep } from '@/types/process'

export default function AdminProcessSteps() {
  const [steps, setSteps] = useState<ProcessStep[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSteps()
  }, [])

  async function fetchSteps() {
    setLoading(true)
    const result = await getProcessSteps()
    if (result.success) {
      setSteps(result.steps)
    }
    setLoading(false)
  }

  async function handleCreate(formData: { title: string; description: string }) {
    const maxOrder = steps.length > 0 ? Math.max(...steps.map(s => s.order_index)) : -1
    const result = await createProcessStep({
      title: formData.title,
      description: formData.description,
      order_index: maxOrder + 1,
    })
    
    if (result.success) {
      await fetchSteps()
      setIsCreating(false)
      setError(null)
    } else {
      setError(result.error || 'Failed to create step')
    }
  }

  async function handleUpdate(id: string, formData: { title: string; description: string }) {
    const step = steps.find(s => s.id === id)
    if (!step) return

    const result = await updateProcessStep({
      id,
      title: formData.title,
      description: formData.description,
      order_index: step.order_index,
    })
    
    if (result.success) {
      await fetchSteps()
      setEditingStep(null)
      setError(null)
    } else {
      setError(result.error || 'Failed to update step')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este paso?')) return
    
    const result = await deleteProcessStep(id)
    if (result.success) {
      await fetchSteps()
      setError(null)
    } else {
      setError(result.error || 'Failed to delete step')
    }
  }

  async function handleReorder(stepId: string, direction: 'up' | 'down') {
    const currentIndex = steps.findIndex(s => s.id === stepId)
    if (currentIndex === -1) return

    const newSteps = [...steps]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= newSteps.length) return

    // Swap order indices
    const temp = newSteps[currentIndex].order_index
    newSteps[currentIndex].order_index = newSteps[targetIndex].order_index
    newSteps[targetIndex].order_index = temp

    // Reorder array
    const [movedStep] = newSteps.splice(currentIndex, 1)
    newSteps.splice(targetIndex, 0, movedStep)

    setSteps(newSteps)

    const result = await reorderProcessSteps(newSteps.map(s => s.id))
    if (!result.success) {
      setError(result.error || 'Failed to reorder steps')
      await fetchSteps() // Revert on error
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light text-cream">Pasos del Proceso</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300"
        >
          <Plus className="w-4 h-4" />
          Agregar paso
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-cream/50">Cargando...</div>
      ) : (
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="bg-petroleum-light/30 border border-cream/10 rounded-lg p-6">
              {editingStep?.id === step.id ? (
                <StepForm
                  initialTitle={step.title}
                  initialDescription={step.description}
                  onSubmit={(formData) => handleUpdate(step.id, formData)}
                  onCancel={() => setEditingStep(null)}
                  submitLabel="Guardar cambios"
                />
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col gap-1 pt-1">
                        <button
                          onClick={() => handleReorder(step.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-cream/30 hover:text-cream disabled:opacity-30 transition-colors"
                        >
                          ↑
                        </button>
                        <GripVertical className="w-5 h-5 text-cream/30" />
                        <button
                          onClick={() => handleReorder(step.id, 'down')}
                          disabled={index === steps.length - 1}
                          className="p-1 text-cream/30 hover:text-cream disabled:opacity-30 transition-colors"
                        >
                          ↓
                        </button>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-serif text-gold/60 text-2xl font-light">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          <h3 className="font-serif text-cream text-xl font-light">{step.title}</h3>
                        </div>
                        <p className="font-sans font-light text-cream/60 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingStep(step)}
                        className="p-2 text-cream/60 hover:text-gold transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(step.id)}
                        className="p-2 text-cream/60 hover:text-red-400 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {isCreating && (
            <div className="bg-petroleum-light/30 border border-gold/30 rounded-lg p-6">
              <StepForm
                initialTitle=""
                initialDescription=""
                onSubmit={handleCreate}
                onCancel={() => setIsCreating(false)}
                submitLabel="Crear paso"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface StepFormProps {
  initialTitle: string
  initialDescription: string
  onSubmit: (formData: { title: string; description: string }) => void
  onCancel: () => void
  submitLabel: string
}

function StepForm({ initialTitle, initialDescription, onSubmit, onCancel, submitLabel }: StepFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return
    onSubmit({ title: title.trim(), description: description.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-cream/60 text-sm mb-2">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="Ej: Consulta inicial"
        />
      </div>
      <div>
        <label className="block text-cream/60 text-sm mb-2">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
          placeholder="Describe el paso del proceso..."
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
