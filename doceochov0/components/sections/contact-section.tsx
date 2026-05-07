'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const projectTypes = [
  'Arquitectura residencial',
  'Arquitectura comercial',
  'Cocina a medida',
  'Vestidor a medida',
  'Living / Comedor',
  'Biblioteca / Estudio',
  'Otro',
]

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  })
  const [sent, setSent] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Build WhatsApp message as fallback
    const msg = `Hola, soy ${formState.name}. Me interesa consultar sobre ${formState.projectType || 'un proyecto'}. Mi email: ${formState.email}. Teléfono: ${formState.phone}. Mensaje: ${formState.message}`
    window.open(`https://wa.me/+54935153927563?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
  }

  return (
    <section
      id="contacto"
      ref={ref}
      className="bg-petroleum-dark py-28 md:py-40 px-6 md:px-10 lg:px-16"
      aria-labelledby="contact-heading"
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
            05 — Contacto
          </motion.span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
          {/* Left — intro */}
          <div className="flex flex-col gap-8">
            <motion.h2
              id="contact-heading"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
              className="font-serif font-light text-cream text-4xl md:text-5xl leading-tight text-balance"
            >
              Hablemos de tu próximo proyecto.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="font-sans font-light text-cream/50 text-base leading-relaxed"
            >
              Cada proyecto empieza con una conversación.
              Contanos qué necesitás y nos ponemos en contacto para coordinar una reunión sin compromiso.
            </motion.p>

            {/* Contact details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col gap-5 pt-4 border-t border-cream/10"
            >
              <a
                href="https://wa.me/+54935153927563"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <span className="w-10 h-10 border border-gold/30 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gold group-hover:text-petroleum-dark transition-colors duration-300" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.128 1.526 5.873L.057 23.887l6.204-1.626A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.86 0-3.62-.476-5.164-1.32l-.37-.22-3.825 1.002 1.024-3.727-.242-.382A9.96 9.96 0 0 1 2 12C2 6.478 6.478 2 12 2s10 4.478 10 10-4.478 10-10 10z" />
                  </svg>
                </span>
                <div>
                  <p className="font-sans text-cream text-sm">+54 9 35153927563</p>
                  <p className="font-sans text-cream/40 text-xs">WhatsApp — respuesta inmediata</p>
                </div>
              </a>

              <a
                href="mailto:doce8.estudio@gmail.com"
                className="flex items-center gap-4 group"
              >
                <span className="w-10 h-10 border border-gold/30 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold group-hover:text-petroleum-dark transition-colors duration-300" aria-hidden="true">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="font-sans text-cream text-sm">doce8.estudio@gmail.com</p>
                  <p className="font-sans text-cream/40 text-xs">Email corporativo</p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <span className="w-10 h-10 border border-gold/30 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold" aria-hidden="true">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="font-sans text-cream text-sm">Córdoba, Argentina</p>
                  <p className="font-sans text-cream/40 text-xs">Nueva Córdoba & Gran Córdoba</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
          >
            {sent ? (
              <div className="flex flex-col items-start gap-6 py-16">
                <span className="font-serif text-gold text-6xl" aria-hidden="true">&rarr;</span>
                <h3 className="font-serif text-cream text-3xl font-light">
                  Mensaje enviado.
                </h3>
                <p className="font-sans font-light text-cream/50 text-base leading-relaxed">
                  Redirigiste al chat de WhatsApp. Nos ponemos en contacto a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40">
                      Nombre
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="bg-transparent border-b border-cream/20 focus:border-gold outline-none text-cream font-sans text-sm py-3 transition-colors duration-300 placeholder:text-cream/20"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="bg-transparent border-b border-cream/20 focus:border-gold outline-none text-cream font-sans text-sm py-3 transition-colors duration-300 placeholder:text-cream/20"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formState.phone}
                    onChange={handleChange}
                    className="bg-transparent border-b border-cream/20 focus:border-gold outline-none text-cream font-sans text-sm py-3 transition-colors duration-300 placeholder:text-cream/20"
                    placeholder="+54 9 351..."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="projectType" className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40">
                    Tipo de proyecto
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formState.projectType}
                    onChange={handleChange}
                    className="bg-petroleum-dark border-b border-cream/20 focus:border-gold outline-none text-cream font-sans text-sm py-3 transition-colors duration-300 cursor-pointer"
                  >
                    <option value="" className="text-cream/40">Seleccioná una opción</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type} className="bg-petroleum-dark">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    className="bg-transparent border-b border-cream/20 focus:border-gold outline-none text-cream font-sans text-sm py-3 resize-none transition-colors duration-300 placeholder:text-cream/20"
                    placeholder="Contanos sobre tu proyecto..."
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 bg-gold text-petroleum-dark font-sans text-[11px] tracking-[0.4em] uppercase py-4 px-8 hover:bg-cream transition-colors duration-300 w-full md:w-auto self-start"
                >
                  Enviar consulta
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
