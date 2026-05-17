'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'
import { getPortfolioProjects } from '@/actions/portfolio-images'
import { getPortfolioCategories } from '@/actions/portfolio-categories'
import { trackPageView } from '@/actions/analytics'
import type { PortfolioProjectWithImages } from '@/types/portfolio'

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [projects, setProjects] = useState<PortfolioProjectWithImages[]>([])
  const [categories, setCategories] = useState<string[]>(['Todos'])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [carouselStates, setCarouselStates] = useState<Record<string, number>>({})

  useEffect(() => {
    // Track page view
    trackPageView('portfolio')

    async function fetchData() {
      try {
        const [projectsResult, categoriesResult] = await Promise.all([
          getPortfolioProjects(),
          getPortfolioCategories()
        ])

        if (projectsResult.success) {
          setProjects(projectsResult.projects)
        }

        if (categoriesResult.success && categoriesResult.categories) {
          const categoryNames = categoriesResult.categories.map(cat => cat.name)
          setCategories(['Todos', ...categoryNames])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  
  const filteredProjects = selectedCategory === 'Todos' 
    ? projects 
    : projects.filter(project => 
        project.category === selectedCategory
      )

  const handleImageClick = (images: string[], index: number) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setLightboxImages([])
    setLightboxIndex(0)
  }

  const handleCarouselChange = (projectId: string, newIndex: number) => {
    setCarouselStates(prev => ({ ...prev, [projectId]: newIndex }))
  }

  // Simple carousel component
  const ProjectCarousel = ({ images, title, projectId }: { images: string[], title: string | null, projectId: string }) => {
    const currentIndex = carouselStates[projectId] || 0
    
    if (images.length === 0) return null
    
    if (images.length === 1) {
      return (
        <div className="relative aspect-[4/5]">
          <Image
            src={images[0]}
            alt={title || 'Portfolio project'}
            fill
            className="object-cover cursor-pointer transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onClick={() => handleImageClick(images, 0)}
          />
        </div>
      )
    }

    return (
      <div className="relative aspect-[4/5] group">
        <Image
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className="object-cover cursor-pointer transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onClick={() => handleImageClick(images, currentIndex)}
        />
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCarouselChange(projectId, currentIndex === 0 ? images.length - 1 : currentIndex - 1)
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCarouselChange(projectId, currentIndex === images.length - 1 ? 0 : currentIndex + 1)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
            >
              →
            </button>
            
            {/* Dots indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCarouselChange(projectId, idx)
                  }}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    idx === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-petroleum-dark/60">Cargando portfolio...</div>
      </div>
    )
  }

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
                  {/* Carousel */}
                  <ProjectCarousel 
                    images={project.images.map(img => img.image_path)}
                    title={project.title}
                    projectId={project.id}
                  />
                    
                    {/* Overlay - visible by default on mobile, enhanced on hover on desktop */}
                    <div className="absolute inset-0 bg-gradient-to-t from-petroleum-dark/60 via-petroleum-dark/20 to-transparent md:bg-petroleum-dark/0 md:group-hover:bg-petroleum-dark/40 transition-colors duration-500 pointer-events-none" />
                    
                    {/* Project info - visible by default on mobile, enhanced on hover on desktop */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-cream pointer-events-none">
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && lightboxImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImages[lightboxIndex]}
                alt={`Full size image ${lightboxIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain"
              />
              
              {/* Navigation arrows for multiple images */}
              {lightboxImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightboxIndex(prev => prev === 0 ? lightboxImages.length - 1 : prev - 1)
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors duration-300"
                  >
                    ←
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightboxIndex(prev => prev === lightboxImages.length - 1 ? 0 : prev + 1)
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors duration-300"
                  >
                    →
                  </button>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                    {lightboxIndex + 1} / {lightboxImages.length}
                  </div>
                </>
              )}
              
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
