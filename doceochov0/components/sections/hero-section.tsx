'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 1.8 } },
  }

  const lineVariant = {
    hidden: { y: '110%', opacity: 0 },
    show: { y: '0%', opacity: 1, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] as const } },
  }

  const fadeUpVariant = {
    hidden: { y: 24, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] as const } },
  }

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative h-screen min-h-[600px] overflow-hidden"
      aria-label="Hero - Arquitectura Interior Premium"
    >
      {/* Parallax image */}
      <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
        <Image
          src="/images/hero-interior.jpg"
          alt="Interior arquitectónico de lujo — DoceOcho Estudio"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-petroleum-dark via-petroleum-dark/55 to-petroleum-dark/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-petroleum-dark/40 to-transparent" />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-10 lg:px-16 max-w-7xl mx-auto"
      >
        {/* Location tag */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="block w-8 h-px bg-gold" />
          <span className="font-sans text-[10px] tracking-[0.45em] text-gold uppercase">
            Córdoba, Argentina
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mb-10"
        >
          <div className="overflow-hidden">
            <motion.h1
              variants={lineVariant}
              className="font-serif font-light text-cream text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] tracking-tight text-balance"
            >
              Donde el diseño
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              variants={lineVariant}
              className="font-serif font-light italic text-cream text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] tracking-tight text-balance"
            >
              y la materia se encuentran.
            </motion.h1>
          </div>
        </motion.div>

        {/* Subtitle + CTAs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-0">
          <motion.p
            variants={fadeUpVariant}
            initial="hidden"
            animate="show"
            className="font-sans font-light text-cream/60 text-sm md:text-base leading-relaxed max-w-md tracking-wide"
          >
            Arquitectura interior y mobiliario a medida.<br />
            Proyectos completos. Detalles que definen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="https://wa.me/5493512000000?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20proyectos."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gold text-petroleum-dark font-sans text-[11px] tracking-[0.35em] uppercase px-6 py-3.5 hover:bg-cream transition-colors duration-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.128 1.526 5.873L.057 23.887l6.204-1.626A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.86 0-3.62-.476-5.164-1.32l-.37-.22-3.825 1.002 1.024-3.727-.242-.382A9.96 9.96 0 0 1 2 12C2 6.478 6.478 2 12 2s10 4.478 10 10-4.478 10-10 10z" />
              </svg>
              Consultar proyecto
            </a>
            <a
              href="https://instagram.com/doce8.estudio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-sans text-[11px] tracking-[0.35em] uppercase text-cream/80 border border-cream/25 px-6 py-3.5 hover:border-cream hover:text-cream transition-all duration-300"
              aria-label="Seguir en Instagram"
            >
              Instagram
            </a>
            <button
              onClick={() => {
                const el = document.querySelector('#proyectos')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              className="font-sans text-[11px] tracking-[0.35em] uppercase text-cream/80 border border-cream/25 px-6 py-3.5 hover:border-cream hover:text-cream transition-all duration-300"
            >
              Ver proyectos
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
          className="absolute right-6 md:right-10 bottom-8 flex flex-col items-center gap-3"
          aria-hidden="true"
        >
          <span className="font-sans text-[8px] tracking-[0.5em] text-cream/40 uppercase rotate-90 mb-4">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-cream/40 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
