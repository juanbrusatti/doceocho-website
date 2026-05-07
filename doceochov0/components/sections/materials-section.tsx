'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

const qualities = [
  {
    label: 'Selección de materiales',
    description:
      'Trabajamos exclusivamente con proveedores seleccionados. Maderas macizas, melaminas premium, pinturas poliuretánicas, herrajes europeos.',
  },
  {
    label: 'Terminados impecables',
    description:
      'Lijado, sellado, lacado o barnizado con capas sucesivas. Cada superficie es inspeccionada antes de salir del taller.',
  },
  {
    label: 'Precisión milimétrica',
    description:
      'Tolerancias de fabricación de ±0.5mm. CNC de última generación y ajuste manual por artesanos especializados.',
  },
  {
    label: 'Herrajes de élite',
    description:
      'Blum, Hettich, Häfele. Bisagras, correderas y sistemas de apertura de la más alta ingeniería europea.',
  },
]

export default function MaterialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

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
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
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
                src="/images/materials-wood-detail.jpg"
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
              transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
              className="font-serif font-light text-cream text-4xl md:text-5xl leading-tight text-balance"
            >
              La calidad es una decisión que se toma antes de empezar.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.76, 0, 0.24, 1] }}
              className="font-sans font-light text-cream/50 text-base leading-relaxed"
            >
              No usamos lo que hay. Seleccionamos lo mejor disponible para cada proyecto,
              cada función, cada exigencia del diseño.
            </motion.p>

            {/* Quality list */}
            <div className="flex flex-col gap-0">
              {qualities.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.8, delay: 0.15 * i + 0.5, ease: [0.76, 0, 0.24, 1] }}
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
          </div>
        </div>
      </div>
    </section>
  )
}
