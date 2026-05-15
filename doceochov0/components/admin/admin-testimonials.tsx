'use client'

import { useState, useEffect } from 'react'
import { X, Plus, GripVertical, Quote as QuoteIcon } from 'lucide-react'
import {
  getTestimonialPhrases,
  getTestimonials,
  createTestimonialPhrase,
  updateTestimonialPhrase,
  deleteTestimonialPhrase,
  reorderTestimonialPhrases,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
} from '@/actions/testimonials'
import type { TestimonialPhrase, Testimonial } from '@/types/testimonials'

export default function AdminTestimonials() {
  const [phrases, setPhrases] = useState<TestimonialPhrase[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPhrase, setEditingPhrase] = useState<TestimonialPhrase | null>(null)
  const [isCreatingPhrase, setIsCreatingPhrase] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [phrasesResult, testimonialsResult] = await Promise.all([
        getTestimonialPhrases(),
        getTestimonials(),
      ])
      if (phrasesResult.success) {
        setPhrases(phrasesResult.phrases)
      } else {
        setError(phrasesResult.error || 'Failed to fetch phrases')
      }
      if (testimonialsResult.success) {
        setTestimonials(testimonialsResult.testimonials)
      } else {
        setError(testimonialsResult.error || 'Failed to fetch testimonials')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('An error occurred while fetching data')
    } finally {
      setLoading(false)
    }
  }

  async function handlePhraseCreate(formData: { quote: string; emphasis: boolean }) {
    const maxOrder = phrases.length > 0 ? Math.max(...phrases.map(p => p.order_index)) : -1
    const result = await createTestimonialPhrase({
      quote: formData.quote,
      emphasis: formData.emphasis,
      order_index: maxOrder + 1,
    })
    
    if (result.success) {
      await fetchData()
      setIsCreatingPhrase(false)
      setError(null)
    } else {
      setError(result.error || 'Failed to create phrase')
    }
  }

  async function handlePhraseUpdate(id: string, formData: { quote: string; emphasis: boolean }) {
    const phrase = phrases.find(p => p.id === id)
    if (!phrase) return

    const result = await updateTestimonialPhrase({
      id,
      quote: formData.quote,
      emphasis: formData.emphasis,
      order_index: phrase.order_index,
    })
    
    if (result.success) {
      await fetchData()
      setEditingPhrase(null)
      setError(null)
    } else {
      setError(result.error || 'Failed to update phrase')
    }
  }

  async function handlePhraseDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta frase?')) return
    
    const result = await deleteTestimonialPhrase(id)
    if (result.success) {
      await fetchData()
      setError(null)
    } else {
      setError(result.error || 'Failed to delete phrase')
    }
  }

  async function handlePhraseReorder(phraseId: string, direction: 'up' | 'down') {
    const currentIndex = phrases.findIndex(p => p.id === phraseId)
    if (currentIndex === -1) return

    const newPhrases = [...phrases]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= newPhrases.length) return

    const temp = newPhrases[currentIndex].order_index
    newPhrases[currentIndex].order_index = newPhrases[targetIndex].order_index
    newPhrases[targetIndex].order_index = temp

    const [movedPhrase] = newPhrases.splice(currentIndex, 1)
    newPhrases.splice(targetIndex, 0, movedPhrase)

    setPhrases(newPhrases)

    const result = await reorderTestimonialPhrases(newPhrases.map(p => p.id))
    if (!result.success) {
      setError(result.error || 'Failed to reorder phrases')
      await fetchData()
    }
  }

  async function handleTestimonialCreate(formData: { quote: string; author: string; role: string }) {
    const maxOrder = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.order_index)) : -1
    const result = await createTestimonial({
      quote: formData.quote,
      author: formData.author,
      role: formData.role,
      order_index: maxOrder + 1,
    })
    
    if (result.success) {
      await fetchData()
      setIsCreatingTestimonial(false)
      setError(null)
    } else {
      setError(result.error || 'Failed to create testimonial')
    }
  }

  async function handleTestimonialUpdate(id: string, formData: { quote: string; author: string; role: string }) {
    const testimonial = testimonials.find(t => t.id === id)
    if (!testimonial) return

    const result = await updateTestimonial({
      id,
      quote: formData.quote,
      author: formData.author,
      role: formData.role,
      order_index: testimonial.order_index,
    })
    
    if (result.success) {
      await fetchData()
      setEditingTestimonial(null)
      setError(null)
    } else {
      setError(result.error || 'Failed to update testimonial')
    }
  }

  async function handleTestimonialDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este testimonio?')) return
    
    const result = await deleteTestimonial(id)
    if (result.success) {
      await fetchData()
      setError(null)
    } else {
      setError(result.error || 'Failed to delete testimonial')
    }
  }

  async function handleTestimonialReorder(testimonialId: string, direction: 'up' | 'down') {
    const currentIndex = testimonials.findIndex(t => t.id === testimonialId)
    if (currentIndex === -1) return

    const newTestimonials = [...testimonials]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= newTestimonials.length) return

    const temp = newTestimonials[currentIndex].order_index
    newTestimonials[currentIndex].order_index = newTestimonials[targetIndex].order_index
    newTestimonials[targetIndex].order_index = temp

    const [movedTestimonial] = newTestimonials.splice(currentIndex, 1)
    newTestimonials.splice(targetIndex, 0, movedTestimonial)

    setTestimonials(newTestimonials)

    const result = await reorderTestimonials(newTestimonials.map(t => t.id))
    if (!result.success) {
      setError(result.error || 'Failed to reorder testimonials')
      await fetchData()
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light text-cream">Lo que dicen</h2>
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
          {/* Phrases Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-cream">Frases Filosóficas</h3>
              <button
                onClick={() => setIsCreatingPhrase(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300"
              >
                <Plus className="w-4 h-4" />
                Agregar frase
              </button>
            </div>

            {phrases.map((phrase, index) => (
              <div key={phrase.id} className="bg-petroleum-light/30 border border-cream/10 rounded-lg p-6">
                {editingPhrase?.id === phrase.id ? (
                  <PhraseForm
                    initialQuote={phrase.quote}
                    initialEmphasis={phrase.emphasis}
                    onSubmit={(formData) => handlePhraseUpdate(phrase.id, formData)}
                    onCancel={() => setEditingPhrase(null)}
                    submitLabel="Guardar cambios"
                  />
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col gap-1 pt-1">
                        <button
                          onClick={() => handlePhraseReorder(phrase.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-cream/30 hover:text-cream disabled:opacity-30 transition-colors"
                        >
                          ↑
                        </button>
                        <GripVertical className="w-5 h-5 text-cream/30" />
                        <button
                          onClick={() => handlePhraseReorder(phrase.id, 'down')}
                          disabled={index === phrases.length - 1}
                          className="p-1 text-cream/30 hover:text-cream disabled:opacity-30 transition-colors"
                        >
                          ↓
                        </button>
                      </div>
                      <div className="flex-1">
                        {phrase.emphasis ? (
                          <p className="font-serif italic text-cream text-lg font-light">
                            &ldquo;{phrase.quote}&rdquo;
                          </p>
                        ) : (
                          <p className="font-serif text-cream/70 text-base font-light">
                            {phrase.quote}
                          </p>
                        )}
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${phrase.emphasis ? 'bg-gold/20 text-gold' : 'bg-cream/10 text-cream/60'}`}>
                            {phrase.emphasis ? 'Con énfasis' : 'Normal'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingPhrase(phrase)}
                        className="p-2 text-cream/60 hover:text-gold transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handlePhraseDelete(phrase.id)}
                        className="p-2 text-cream/60 hover:text-red-400 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isCreatingPhrase && (
              <div className="bg-petroleum-light/30 border border-gold/30 rounded-lg p-6">
                <PhraseForm
                  initialQuote=""
                  initialEmphasis={false}
                  onSubmit={handlePhraseCreate}
                  onCancel={() => setIsCreatingPhrase(false)}
                  submitLabel="Crear frase"
                />
              </div>
            )}
          </div>

          {/* Testimonials Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-cream">Testimonios</h3>
              <button
                onClick={() => setIsCreatingTestimonial(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-petroleum-dark rounded hover:bg-gold/80 transition-colors duration-300"
              >
                <Plus className="w-4 h-4" />
                Agregar testimonio
              </button>
            </div>

            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="bg-petroleum-light/30 border border-cream/10 rounded-lg p-6">
                {editingTestimonial?.id === testimonial.id ? (
                  <TestimonialForm
                    initialQuote={testimonial.quote}
                    initialAuthor={testimonial.author}
                    initialRole={testimonial.role}
                    onSubmit={(formData) => handleTestimonialUpdate(testimonial.id, formData)}
                    onCancel={() => setEditingTestimonial(null)}
                    submitLabel="Guardar cambios"
                  />
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col gap-1 pt-1">
                        <button
                          onClick={() => handleTestimonialReorder(testimonial.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-cream/30 hover:text-cream disabled:opacity-30 transition-colors"
                        >
                          ↑
                        </button>
                        <GripVertical className="w-5 h-5 text-cream/30" />
                        <button
                          onClick={() => handleTestimonialReorder(testimonial.id, 'down')}
                          disabled={index === testimonials.length - 1}
                          className="p-1 text-cream/30 hover:text-cream disabled:opacity-30 transition-colors"
                        >
                          ↓
                        </button>
                      </div>
                      <div className="flex-1">
                        <div className="mb-3">
                          <span className="font-serif text-gold text-4xl leading-none">&ldquo;</span>
                        </div>
                        <p className="font-sans font-light text-cream/75 text-sm leading-relaxed mb-4">
                          {testimonial.quote}
                        </p>
                        <div className="flex flex-col gap-1">
                          <span className="font-sans text-cream text-sm font-medium">{testimonial.author}</span>
                          <span className="font-sans text-cream/40 text-xs tracking-wide">{testimonial.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTestimonial(testimonial)}
                        className="p-2 text-cream/60 hover:text-gold transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleTestimonialDelete(testimonial.id)}
                        className="p-2 text-cream/60 hover:text-red-400 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isCreatingTestimonial && (
              <div className="bg-petroleum-light/30 border border-gold/30 rounded-lg p-6">
                <TestimonialForm
                  initialQuote=""
                  initialAuthor=""
                  initialRole=""
                  onSubmit={handleTestimonialCreate}
                  onCancel={() => setIsCreatingTestimonial(false)}
                  submitLabel="Crear testimonio"
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

interface PhraseFormProps {
  initialQuote: string
  initialEmphasis: boolean
  onSubmit: (formData: { quote: string; emphasis: boolean }) => void
  onCancel: () => void
  submitLabel: string
}

function PhraseForm({ initialQuote, initialEmphasis, onSubmit, onCancel, submitLabel }: PhraseFormProps) {
  const [quote, setQuote] = useState(initialQuote)
  const [emphasis, setEmphasis] = useState(initialEmphasis)
  const [validationError, setValidationError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!quote.trim()) {
      setValidationError('La frase es obligatoria')
      return
    }
    setValidationError(null)
    onSubmit({ quote: quote.trim(), emphasis })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {validationError && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded text-sm">
          {validationError}
        </div>
      )}
      <div>
        <label className="block text-cream/60 text-sm mb-2">Frase</label>
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
          placeholder="Ej: Los espacios se recuerdan a través de sus detalles."
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="emphasis"
          checked={emphasis}
          onChange={(e) => setEmphasis(e.target.checked)}
          className="w-4 h-4 accent-gold"
        />
        <label htmlFor="emphasis" className="text-cream/60 text-sm">Con énfasis (estilo itálica destacado)</label>
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

interface TestimonialFormProps {
  initialQuote: string
  initialAuthor: string
  initialRole: string
  onSubmit: (formData: { quote: string; author: string; role: string }) => void
  onCancel: () => void
  submitLabel: string
}

function TestimonialForm({ initialQuote, initialAuthor, initialRole, onSubmit, onCancel, submitLabel }: TestimonialFormProps) {
  const [quote, setQuote] = useState(initialQuote)
  const [author, setAuthor] = useState(initialAuthor)
  const [role, setRole] = useState(initialRole)
  const [validationError, setValidationError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!quote.trim() || !author.trim() || !role.trim()) {
      setValidationError('Todos los campos son obligatorios')
      return
    }
    setValidationError(null)
    onSubmit({ quote: quote.trim(), author: author.trim(), role: role.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {validationError && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded text-sm">
          {validationError}
        </div>
      )}
      <div>
        <label className="block text-cream/60 text-sm mb-2">Cita</label>
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
          placeholder="El testimonio del cliente..."
        />
      </div>
      <div>
        <label className="block text-cream/60 text-sm mb-2">Autor</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="Ej: Arq. Valentina R."
        />
      </div>
      <div>
        <label className="block text-cream/60 text-sm mb-2">Rol</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-2 bg-petroleum-dark/50 border border-cream/20 rounded text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="Ej: Estudio de Arquitectura, Córdoba"
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
