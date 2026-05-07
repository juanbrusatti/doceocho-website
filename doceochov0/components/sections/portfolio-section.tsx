'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const categories = ['Todos', 'Residencial', 'Comercial', 'Mobiliario']

const projects = [
  {
    id: 1,
    title: 'Casa Olivos',
    category: 'Residencial',
    description: 'Proyecto residencial integral — Living, cocina y dormitorios en roble americano y microcemento.',
    image: '/images/project-residential-01.jpg',
    year: '2024',
    size: 'large',
  },
  {
    id: 2,
    title: 'Suite Nórdica',
    category: 'Residencial',
    description: 'Vestidor y habitación principal. Carpintería en melamina soft-touch con tirador embutido.',
    image: '/images/project-dressing-01.jpg',
    year: '2024',
    size: 'small',
  },
  {
    id: 3,
    title: 'Estudio Jurídico Norte',
    category: 'Comercial',
    description: 'Reforma integral de oficinas. Panelería mural, biblioteca integrada y mobiliario de dirección.',
    image: '/images/project-commercial-01.jpg',
    year: '2023',
    size: 'small',
  },
  {
    id: 4,
    title: 'Cocina Belgrano',
    category: 'Mobiliario',
    description: 'Cocina a medida en poliuretano mate con cubierta de cuarzo. Diseño ergonómico y almacenamiento inteligente.',
    image: '/images/project-kitchen-01.jpg',
    year: '2023',
    size: 'large',
  },
  {
    id: 5,
    title: 'Biblioteca Privada',
    category: 'Mobiliario',
    description: 'Biblioteca de piso a techo en cedro natural con escalera de biblioteca integrada.',
    image: '/images/project-library-01.jpg',
    year: '2023',
    size: 'small',
  },
]

export default function PortfolioSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const filtered =
    activeCategory === 'Todos'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  return (
    <section
      id="proyectos"
      ref={ref}
      className="bg-cream py-28 md:py-40 px-6 md:px-10 lg:px-16"
      aria-labelledby="portfolio-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-8">
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
                03 — Proyectos
              </motion.span>
            </div>
            <motion.h2
              id="portfolio-heading"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] as const }}
              className="font-serif font-light text-petroleum-dark text-4xl md:text-5xl lg:text-6xl leading-tight text-balance"
            >
              Ambientes que definen<br className="hidden md:block" /> una forma de vivir.
            </motion.h2>
          </div>

          {/* Category filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filtrar proyectos por categoría"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-sans text-[10px] tracking-[0.3em] uppercase px-4 py-2 border transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-petroleum-dark text-cream border-petroleum-dark'
                    : 'bg-transparent text-petroleum-dark/50 border-petroleum-dark/20 hover:border-petroleum-dark/50 hover:text-petroleum-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Projects grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.76, 0, 0.24, 1] as const }}
                className={`relative overflow-hidden group cursor-pointer ${
                  project.size === 'large' ? 'md:col-span-2' : ''
                }`}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Image */}
                <div
                  className={`relative overflow-hidden ${
                    project.size === 'large' ? 'aspect-[16/7]' : 'aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes={project.size === 'large' ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                  />
                  <div className="absolute inset-0 bg-petroleum-dark/20 group-hover:bg-petroleum-dark/40 transition-colors duration-500" />
                </div>

                {/* Project info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="block font-sans text-[9px] tracking-[0.4em] uppercase text-gold mb-2">
                        {project.category} — {project.year}
                      </span>
                      <h3 className="font-serif text-cream text-2xl md:text-3xl font-light">
                        {project.title}
                      </h3>
                      <AnimatePresence>
                        {hoveredProject === project.id && (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className="font-sans font-light text-cream/70 text-sm leading-relaxed mt-2 max-w-lg"
                          >
                            {project.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <motion.div
                      animate={hoveredProject === project.id ? { x: 0, opacity: 1 } : { x: 10, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gold text-2xl font-light"
                      aria-hidden="true"
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center mt-16"
        >
          <a
            href="https://wa.me/5493512000000?text=Hola%2C%20quisiera%20ver%20m%C3%A1s%20proyectos%20del%20estudio."
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] tracking-[0.4em] uppercase text-petroleum-dark border border-petroleum-dark/30 px-8 py-4 hover:bg-petroleum-dark hover:text-cream transition-all duration-400 inline-flex items-center gap-4"
          >
            Ver portfolio completo
            <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
