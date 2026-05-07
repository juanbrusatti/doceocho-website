'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { label: 'Estudio', href: '#estudio' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Materiales', href: '#materiales' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      setScrolled(current > 60)
      setHidden(current > lastScrollY.current && current > 120)
      lastScrollY.current = current
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: hidden ? -100 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'backdrop-blur-md bg-petroleum-dark/70 border-b border-cream/10'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-5 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="DoceOcho Studio - Ir al inicio"
          >
            <div className="relative w-10 h-10">
              <Image
                src="/logo-doce8.png"
                alt="DoceOcho Estudio Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-serif text-cream text-2xl tracking-[0.2em] font-light leading-none group-hover:text-gold transition-colors duration-300">
                DoceOcho
              </span>
              <span className="font-sans text-gold text-[7px] tracking-[0.5em] uppercase leading-none">
                Estudio
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="font-sans text-[11px] tracking-[0.25em] uppercase text-cream/70 hover:text-gold transition-colors duration-300 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA + burger */}
          <div className="flex items-center gap-6">
            <a
              href="https://wa.me/54935153927563?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20proyectos."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-sans text-gold border border-gold/40 px-4 py-2 hover:bg-gold hover:text-petroleum-dark transition-all duration-300"
            >
              WhatsApp
            </a>

            {/* Mobile burger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="block w-6 h-px bg-cream origin-center transition-colors"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-6 h-px bg-cream"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="block w-6 h-px bg-cream origin-center"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-petroleum-dark flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                onClick={() => handleNavClick(link.href)}
                className="font-serif text-cream text-4xl font-light italic hover:text-gold transition-colors duration-300 cursor-pointer"
              >
                {link.label}
              </motion.button>
            ))}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.07 + 0.1, duration: 0.4 }}
              href="https://wa.me/54935153927563"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 text-[10px] tracking-[0.4em] uppercase font-sans text-gold border border-gold/40 px-8 py-3 hover:bg-gold hover:text-petroleum-dark transition-all duration-300"
            >
              WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
