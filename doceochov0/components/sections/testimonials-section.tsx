'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { getTestimonialPhrases, getTestimonials } from '@/actions/testimonials'
import type { TestimonialPhrase, Testimonial } from '@/types/testimonials'

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const [phrases, setPhrases] = useState<TestimonialPhrase[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [phrasesResult, testimonialsResult] = await Promise.all([
          getTestimonialPhrases(),
          getTestimonials(),
        ])
        
        if (phrasesResult.success) {
          setPhrases(phrasesResult.phrases)
        } else {
          setError(phrasesResult.error || 'Failed to load phrases')
        }
        
        if (testimonialsResult.success) {
          setTestimonials(testimonialsResult.testimonials)
        } else {
          setError(testimonialsResult.error || 'Failed to load testimonials')
        }
      } catch (error) {
        console.error('Error fetching testimonials data:', error)
        setError('An error occurred while loading testimonials')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <section
      ref={ref}
      className="bg-cream py-28 md:py-40 px-6 md:px-10 lg:px-16"
      aria-label="Filosofía y testimonios"
    >
      <div className="max-w-7xl mx-auto">
        {/* Philosophy phrases */}
        {loading ? (
          <div className="flex flex-col items-center gap-6 mb-28 md:mb-40">
            <div className="inline-block w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
            <p className="text-petroleum-dark/50 text-sm">Cargando...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-6 mb-28 md:mb-40">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 mb-28 md:mb-40">
            {phrases.map((phrase, i) => (
              <motion.div
                key={phrase.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 1, delay: i * 0.2, ease: [0.76, 0, 0.24, 1] as const }}
                className="text-center"
              >
                {phrase.emphasis ? (
                  <p className="font-serif italic text-petroleum-dark text-3xl md:text-4xl lg:text-5xl font-light text-balance">
                    &ldquo;{phrase.quote}&rdquo;
                  </p>
                ) : (
                  <p className="font-serif text-petroleum-dark/40 text-xl md:text-2xl lg:text-3xl font-light text-balance">
                    {phrase.quote}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] as const, delay: 0.5 }}
          className="w-full h-px bg-petroleum-dark/10 mb-20 origin-left"
        />

        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] as const, delay: 0.6 }}
            className="block w-12 h-px bg-gold origin-left"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="font-sans text-[10px] tracking-[0.45em] text-gold uppercase"
          >
            Lo que dicen
          </motion.span>
        </div>

        {/* Testimonials grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-petroleum-dark/30 border-t-petroleum-dark rounded-full animate-spin"></div>
            <p className="mt-4 text-petroleum-dark/50 text-sm">Cargando testimonios...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-petroleum-dark/50 text-sm">No hay testimonios disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {testimonials.map((t, i) => (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.1 * i + 0.7, ease: [0.76, 0, 0.24, 1] as const }}
                className="flex flex-col gap-6 border-t border-petroleum-dark/10 pt-8"
              >
                <span className="font-serif text-gold text-4xl leading-none" aria-hidden="true">&ldquo;</span>
                <blockquote>
                  <p className="font-sans font-light text-petroleum-dark/75 text-sm leading-relaxed">
                    {t.quote}
                  </p>
                </blockquote>
                <figcaption className="flex flex-col gap-1 mt-auto">
                  <span className="font-sans text-petroleum-dark text-sm font-medium">{t.author}</span>
                  <span className="font-sans text-petroleum-dark/40 text-xs tracking-wide">{t.role}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
