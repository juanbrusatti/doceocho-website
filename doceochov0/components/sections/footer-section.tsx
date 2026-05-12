'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function FooterSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <footer
      ref={ref}
      className="bg-petroleum-dark border-t border-cream/5 py-20 px-6 md:px-10 lg:px-16"
      aria-label="Pie de página"
    >
      <div className="max-w-7xl mx-auto">
        {/* Final statement */}
        <div className="flex flex-col items-center text-center gap-3 pb-20 border-b border-cream/10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.8 }}
            className="font-sans text-[9px] tracking-[0.5em] uppercase text-gold"
          >
            DoceOcho Estudio
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.76, 0, 0.24, 1] as const }}
            className="font-serif font-light italic text-cream text-3xl md:text-4xl lg:text-5xl text-balance max-w-2xl"
          >
            &ldquo;Diseño en conjunto. Córdoba, Argentina.&rdquo;
          </motion.p>
        </div>

        {/* Footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 pt-14">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col gap-4 md:col-span-1"
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-serif text-cream text-2xl tracking-[0.2em] font-light">DoceOcho Estudio</span>
              <span className="font-sans text-gold text-[7px] tracking-[0.5em] uppercase">Estudio</span>
            </div>
            <p className="font-sans font-light text-cream/40 text-xs leading-relaxed">
              Arquitectura interior y mobiliario a medida.
              Córdoba, Argentina.
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            aria-label="Navegación del pie de página"
          >
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-gold mb-5">
              Navegación
            </p>
            <ul className="flex flex-col gap-3">
              {['Estudio', 'Proceso', 'Proyectos', 'Materiales', 'Contacto'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      const el = document.querySelector(`#${item.toLowerCase()}`)
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="font-sans font-light text-cream/50 text-xs hover:text-gold transition-colors duration-300 cursor-pointer"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-gold mb-5">
              Especialidades
            </p>
            <ul className="flex flex-col gap-3">
              {[
                'Arquitectura residencial',
                'Arquitectura comercial',
                'Cocinas a medida',
                'Vestidores',
                'Panelería mural',
                'Bibliotecas',
              ].map((item) => (
                <li key={item}>
                  <span className="font-sans font-light text-cream/40 text-xs">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col gap-4"
          >
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-gold">
              Contacto
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5493584178955"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-light text-cream/50 text-xs hover:text-gold transition-colors duration-300"
              >
                +54 9 358 417-8955
              </a>
              <a
                href="mailto:doce8.estudio@gmail.com"
                className="font-sans font-light text-cream/50 text-xs hover:text-gold transition-colors duration-300"
              >
                doce8.estudio@gmail.com
              </a>
              <a
                href="https://instagram.com/doce8.estudio"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-light text-cream/50 text-xs hover:text-gold transition-colors duration-300"
              >
                @doce8.estudio
              </a>
              <span className="font-sans font-light text-cream/30 text-xs">
                Córdoba, Argentina
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-12 border-t border-cream/5 mt-14">
          <p className="font-sans text-cream/25 text-[10px] tracking-wider">
            © 2026 DoceOcho Estudio. Todos los derechos reservados.
          </p>
          <p className="font-sans text-cream/20 text-[10px] tracking-wider">
            Córdoba, Argentina
          </p>
          <a
            href="https://dlay.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-cream/15 text-[10px] tracking-wider hover:text-cream/30 transition-colors duration-300"
          >
            Desarrollado con ❤️ por dlay.com.ar
          </a>
        </div>
      </div>
    </footer>
  )
}
