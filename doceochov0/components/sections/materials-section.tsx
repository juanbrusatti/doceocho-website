'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { getMaterialsContent, getMaterialQualities } from '@/actions/materials'
import type { MaterialsContent, MaterialQuality } from '@/types/materials'

export default function MaterialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const [content, setContent] = useState<MaterialsContent | null>(null)
  const [qualities, setQualities] = useState<MaterialQuality[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  useEffect(() => {
    async function fetchData() {
      try {
        const [contentResult, qualitiesResult] = await Promise.all([
          getMaterialsContent(),
          getMaterialQualities(),
        ])
        
        if (contentResult.success) {
          setContent(contentResult.content || null)
        } else {
          setError(contentResult.error || 'Failed to load materials content')
        }
        
        if (qualitiesResult.success) {
          setQualities(qualitiesResult.qualities)
        } else {
          setError(qualitiesResult.error || 'Failed to load material qualities')
        }
      } catch (error) {
        console.error('Error fetching materials data:', error)
        setError('An error occurred while loading materials')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <section
      id="materiales"
      ref={ref}
      className="bg-petroleum-dark py-28 md:py-40 px-6 md:px-10 lg:px-16"
      aria-labelledby="materials-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-20">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] as const }}
            className="block w-12 h-px bg-gold origin-left"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-sans text-[10px] tracking-[0.45em] text-gold uppercase"
          >
            04 — Materialidad
          </motion.span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
          {/* Image */}
          <div ref={imageRef} className="relative overflow-hidden aspect-[3/4]">
            <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
              <Image
                src={content?.image_path || '/images/materials-wood-detail.jpg'}
                alt="Detalle de madera premium — calidad de terminado DoceOcho Estudio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <div className="absolute inset-0 bg-petroleum-dark/20" />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-10 lg:pt-4">
            <motion.h2
              id="materials-heading"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] as const }}
              className="font-serif font-light text-cream text-4xl md:text-5xl leading-tight text-balance"
            >
              {content?.title || 'La materia prima importa tanto como el diseño.'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.76, 0, 0.24, 1] as const }}
              className="font-sans font-light text-cream/50 text-base leading-relaxed"
            >
              {content?.description || 'No usamos lo que hay. Seleccionamos lo mejor disponible para cada proyecto, cada función, cada exigencia del diseño.'}
            </motion.p>

            <motion.blockquote
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.9, delay: 0.45 }}
              className="border-l-2 border-gold pl-6 mt-4"
            >
              <p className="font-serif italic text-cream text-xl md:text-2xl leading-snug">
                &ldquo;{content?.quote || 'Construido para ser usado. Diseñado para perdurar.'}&rdquo;
              </p>
            </motion.blockquote>

            {/* Quality list */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                <p className="mt-4 text-cream/50 text-sm">Cargando materiales...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            ) : qualities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-cream/50 text-sm">No hay características disponibles</p>
              </div>
            ) : (
              <div className="flex flex-col gap-0">
                {qualities.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.8, delay: 0.15 * i + 0.5, ease: [0.76, 0, 0.24, 1] as const }}
                    className="group border-b border-cream/10 py-6 hover:border-gold/30 transition-colors duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-sans text-gold text-[9px] tracking-widest mt-1.5">
                        0{i + 1}
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <h3 className="font-serif text-cream text-lg font-light group-hover:text-gold transition-colors duration-300">
                          {item.label}
                        </h3>
                        <p className="font-sans font-light text-cream/40 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
