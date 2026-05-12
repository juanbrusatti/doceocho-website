'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Mock project data - will be replaced with real projects in future
const projects = [
  {
    id: 1,
    title: 'Casa Olivos',
    image: '/images/project-residential-01.jpg',
    category: 'residencial'
  },
  {
    id: 2,
    title: 'Suite Nórdica',
    image: '/images/project-dressing-01.jpg',
    category: 'residencial'
  },
  {
    id: 3,
    title: 'Estudio Jurídico Norte',
    image: '/images/project-commercial-01.jpg',
    category: 'comercial'
  },
  {
    id: 4,
    title: 'Cocina Belgrano',
    image: '/images/project-kitchen-01.jpg',
    category: 'mobiliario'
  },
  {
    id: 5,
    title: 'Biblioteca Privada',
    image: '/images/project-library-01.jpg',
    category: 'mobiliario'
  },
  {
    id: 6,
    title: 'Living Moderno',
    image: '/images/project-residential-01.jpg',
    category: 'residencial'
  },
  {
    id: 7,
    title: 'Oficina Ejecutiva',
    image: '/images/project-commercial-01.jpg',
    category: 'comercial'
  },
  {
    id: 8,
    title: 'Vestidor Minimalista',
    image: '/images/project-dressing-01.jpg',
    category: 'mobiliario'
  },
  {
    id: 9,
    title: 'Cocina Integral',
    image: '/images/project-kitchen-01.jpg',
    category: 'mobiliario'
  },
  {
    id: 10,
    title: 'Suite Principal',
    image: '/images/project-residential-01.jpg',
    category: 'residencial'
  },
  {
    id: 11,
    title: 'Espacio Comercial',
    image: '/images/project-commercial-01.jpg',
    category: 'comercial'
  },
  {
    id: 12,
    title: 'Biblioteca Contemporánea',
    image: '/images/project-library-01.jpg',
    category: 'mobiliario'
  }
]

const categories = ['Todos', 'Residencial', 'Comercial', 'Mobiliario']

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  
  const filteredProjects = selectedCategory === 'Todos' 
    ? projects 
    : projects.filter(project => 
        project.category.toLowerCase() === selectedCategory.toLowerCase()
      )

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <section className="py-20 md:py-32 px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] as const }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-between mb-6">
              <motion.a
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                href="/"
                className="flex items-center gap-2 font-sans text-[10px] tracking-[0.3em] uppercase text-petroleum-dark/60 hover:text-petroleum-dark transition-colors duration-300"
              >
                Volver al inicio
              </motion.a>
            </div>
            <h1 className="font-serif font-light text-petroleum-dark text-4xl md:text-5xl lg:text-6xl">
              Portfolio
            </h1>
            <p className="font-sans font-light text-petroleum-dark/50 text-base max-w-2xl mx-auto">
              Proyectos completos que transforman espacios en experiencias únicas
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
            role="tablist"
            aria-label="Filtrar proyectos por categoría"
          >
            {categories.map((category) => (
              <button
                key={category}
                role="tab"
                aria-selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={`font-sans text-[10px] tracking-[0.3em] uppercase px-6 py-3 border transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-petroleum-dark text-cream border-petroleum-dark'
                    : 'bg-transparent text-petroleum-dark/50 border-petroleum-dark/20 hover:border-petroleum-dark/50 hover:text-petroleum-dark'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 md:pb-32 px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.05,
                    ease: [0.76, 0, 0.24, 1] as const
                  }}
                  className="group relative overflow-hidden aspect-[4/5]"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onFocus={() => setHoveredProject(project.id)}
                  onBlur={() => setHoveredProject(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver proyecto: ${project.title}`}
                >
                  {/* Image */}
                  <div className="relative w-full h-full">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    
                    {/* Overlay - visible by default on mobile, enhanced on hover on desktop */}
                    <div className="absolute inset-0 bg-gradient-to-t from-petroleum-dark/60 via-petroleum-dark/20 to-transparent md:bg-petroleum-dark/0 md:group-hover:bg-petroleum-dark/40 transition-colors duration-500" />
                    
                    {/* Project info - visible by default on mobile, enhanced on hover on desktop */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-cream">
                      <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        animate={{
                          opacity: hoveredProject === project.id ? 1 : 1,
                          y: hoveredProject === project.id ? 0 : 0,
                          scale: hoveredProject === project.id ? 1.02 : 1
                        }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden"
                      >
                        <h3 className="font-serif text-lg md:text-xl font-light mb-1">
                          {project.title}
                        </h3>
                        <p className="font-sans text-xs text-cream/80 capitalize">
                          {project.category}
                        </p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={hoveredProject === project.id ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="hidden md:block"
                      >
                        <h3 className="font-serif text-xl md:text-2xl font-light mb-2">
                          {project.title}
                        </h3>
                        <p className="font-sans text-sm text-cream/80 capitalize">
                          {project.category}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-20"
            >
              <p className="font-sans text-petroleum-dark/50 text-lg">
                No hay proyectos en esta categoría
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
