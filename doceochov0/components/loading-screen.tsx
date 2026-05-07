'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 600)
          return 100
        }
        return prev + Math.random() * 18 + 4
      })
    }, 120)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] as const }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-petroleum-dark"
        >
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative w-48 h-48 md:w-56 md:h-56">
              <Image
                src="/logo-doce8.png"
                alt="DoceOcho Estudio Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-serif text-cream text-5xl tracking-[0.25em] font-light">
                DoceOcho
              </span>
              <span className="font-sans text-gold text-[10px] tracking-[0.5em] uppercase">
                Estudio
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-32 h-px bg-cream/20 relative overflow-hidden mt-4">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gold"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: 'linear', duration: 0.1 }}
              />
            </div>

            <motion.span
              className="font-sans text-cream/30 text-[10px] tracking-[0.4em] uppercase"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Córdoba, Argentina
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
