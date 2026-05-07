'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const stats = [
  { value: '12+', label: 'Años de experiencia' },
  { value: '180+', label: 'Proyectos ejecutados' },
  { value: '100%', label: 'Proyectos integrales' },
]

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as const } },
  }
  const lineReveal = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] as const } },
  }

  return (
    <section
      id="estudio"
      ref={ref}
      className="bg-cream py-28 md:py-40 px-6 md:px-10 lg:px-16"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="flex items-center gap-4 mb-16"
        >
          <motion.span
            variants={lineReveal}
            className="block w-12 h-px bg-gold origin-left"
          />
          <motion.span
            variants={fadeUp}
            className="font-sans text-[10px] tracking-[0.45em] text-gold uppercase"
          >
            01 — El Estudio
          </motion.span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          {/* Text column */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
            className="flex flex-col gap-8"
          >
            <div className="overflow-hidden">
              <motion.h2
                variants={fadeUp}
                id="about-heading"
                className="font-serif font-light text-petroleum-dark text-4xl md:text-5xl lg:text-6xl leading-tight text-balance"
              >
                Diseñamos ambientes que trascienden la tendencia.
              </motion.h2>
            </div>

            <motion.p
              variants={fadeUp}
              className="font-sans font-light text-petroleum-dark/70 text-base leading-relaxed max-w-md"
            >
              Somos un estudio de arquitectura interior especializado en proyectos completos.
              Diseñamos, fabricamos e instalamos cada ambiente con una obsesión por el detalle
              que pocas veces se encuentra en el mercado.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="font-sans font-light text-petroleum-dark/70 text-base leading-relaxed max-w-md"
            >
              Nuestra fortaleza no es el mueble aislado — es la capacidad de concebir y ejecutar
              el espacio completo, desde la arquitectura hasta el último terminado.
            </motion.p>

            <motion.blockquote
              variants={fadeUp}
              className="border-l-2 border-gold pl-6 mt-2"
            >
              <p className="font-serif italic text-petroleum-dark text-xl md:text-2xl leading-snug">
                &ldquo;La calidad no se exhibe. Se siente en cada superficie que tocás.&rdquo;
              </p>
            </motion.blockquote>

            {/* Stats row */}
            <motion.div
              variants={stagger}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-petroleum-dark/10"
            >
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={fadeUp} className="flex flex-col gap-1">
                  <span className="font-serif text-3xl md:text-4xl text-petroleum-dark font-light">
                    {stat.value}
                  </span>
                  <span className="font-sans text-[10px] text-petroleum-dark/50 leading-snug tracking-wide uppercase">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.76, 0, 0.24, 1] as const }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/studio-workshop.jpg"
                alt="Taller de DoceOcho Studio — proceso de fabricación artesanal"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-petroleum-dark/10" />
            </div>
            {/* Decorative frame offset */}
            <div className="absolute -bottom-4 -right-4 w-3/4 h-3/4 border border-gold/20 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
