'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Consulta inicial',
    description:
      'Una conversación para entender el proyecto en profundidad. Escuchamos antes de proponer. Cada espacio tiene su propia lógica y necesidades.',
  },
  {
    number: '02',
    title: 'Relevamiento',
    description:
      'Análisis técnico y arquitectónico del espacio. Medidas, condicionantes estructurales, luz natural, circulaciones. El dato preciso define el diseño posible.',
  },
  {
    number: '03',
    title: 'Desarrollo de diseño',
    description:
      'Propuesta integral con planos, renders y selección de materiales. Cada decisión estética responde a una lógica funcional y constructiva.',
  },
  {
    number: '04',
    title: 'Fabricación',
    description:
      'Todo se produce en nuestro taller. Control total del proceso, los materiales y los terminados. Sin intermediarios que diluyan la calidad.',
  },
  {
    number: '05',
    title: 'Instalación',
    description:
      'Equipo propio para la instalación. Milimétrica. Sin apresuramiento. El terminado de obra es tan importante como el diseño.',
  },
  {
    number: '06',
    title: 'Entrega final',
    description:
      'Revisión completa con el cliente. Garantía sobre materiales y ejecución. El proyecto no termina en la instalación — termina en la satisfacción.',
  },
]

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      id="proceso"
      ref={ref}
      className="bg-petroleum-dark py-28 md:py-40 px-6 md:px-10 lg:px-16"
      aria-labelledby="process-heading"
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
            02 — Proceso
          </motion.span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
          <motion.h2
            id="process-heading"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] as const }}
            className="font-serif font-light text-cream text-4xl md:text-5xl lg:text-6xl leading-tight text-balance"
          >
            ¿Cómo es trabajar con nosotros?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.76, 0, 0.24, 1] as const }}
            className="font-sans font-light text-cream/50 text-base leading-relaxed self-end"
          >
            Un proceso claro, riguroso y transparente. Desde la primera conversación hasta la entrega final,
            cada etapa tiene un propósito definido.
          </motion.p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.1 * i + 0.4, ease: [0.76, 0, 0.24, 1] as const }}
              className="group relative border-t border-cream/10 pt-8 pb-10 pr-8 hover:border-gold/40 transition-colors duration-500"
            >
              {/* Step number */}
              <div className="flex items-start justify-between mb-6">
                <span className="font-serif text-gold/30 text-5xl font-light leading-none group-hover:text-gold/60 transition-colors duration-500">
                  {step.number}
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 * i + 0.6 }}
                  className="w-8 h-px bg-gold/20 mt-4 origin-right group-hover:bg-gold/60 transition-colors duration-500"
                />
              </div>

              <h3 className="font-serif text-cream text-xl font-light mb-3 group-hover:text-gold transition-colors duration-300">
                {step.title}
              </h3>
              <p className="font-sans font-light text-cream/45 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
