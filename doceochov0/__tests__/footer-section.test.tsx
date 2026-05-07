/**
 * Tests for footer-section.tsx
 *
 * Scope (PR change):
 *  - Added a new anchor link at the bottom: href="https://dlay.com.ar"
 *    with target="_blank", rel="noopener noreferrer",
 *    and text content "Desarrollado con ❤️ por dlay.com.ar"
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import FooterSection from '../components/sections/footer-section'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...rest}>{children}</div>
    ),
    nav: ({ children, className, 'aria-label': ariaLabel, ...rest }: React.HTMLAttributes<HTMLElement> & { 'aria-label'?: string }) => (
      <nav className={className} aria-label={ariaLabel} {...rest}>{children}</nav>
    ),
    span: ({ children, className, ...rest }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className} {...rest}>{children}</span>
    ),
    p: ({ children, className, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={className} {...rest}>{children}</p>
    ),
  },
  useInView: () => true,
}))

describe('FooterSection – dlay.com.ar link (PR change)', () => {
  it('renders the dlay.com.ar link', () => {
    render(<FooterSection />)
    const dlayLink = screen.getByRole('link', { name: /dlay\.com\.ar/i })
    expect(dlayLink).toBeInTheDocument()
  })

  it('dlay.com.ar link has correct href', () => {
    render(<FooterSection />)
    const dlayLink = screen.getByRole('link', { name: /dlay\.com\.ar/i })
    expect(dlayLink).toHaveAttribute('href', 'https://dlay.com.ar')
  })

  it('dlay.com.ar link opens in a new tab', () => {
    render(<FooterSection />)
    const dlayLink = screen.getByRole('link', { name: /dlay\.com\.ar/i })
    expect(dlayLink).toHaveAttribute('target', '_blank')
  })

  it('dlay.com.ar link has rel="noopener noreferrer"', () => {
    render(<FooterSection />)
    const dlayLink = screen.getByRole('link', { name: /dlay\.com\.ar/i })
    expect(dlayLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('dlay.com.ar link contains the expected text content', () => {
    render(<FooterSection />)
    const dlayLink = screen.getByRole('link', { name: /dlay\.com\.ar/i })
    expect(dlayLink.textContent).toContain('dlay.com.ar')
    expect(dlayLink.textContent).toContain('Desarrollado con')
  })

  it('dlay.com.ar link is located within the bottom bar section (alongside copyright)', () => {
    render(<FooterSection />)
    const copyright = screen.getByText(/© 2026 DoceOcho Estudio/i)
    const dlayLink = screen.getByRole('link', { name: /dlay\.com\.ar/i })
    // Both should be present in the same footer region
    expect(copyright).toBeInTheDocument()
    expect(dlayLink).toBeInTheDocument()
    // They should share a common ancestor (the bottom bar div)
    expect(copyright.closest('div')).toBe(dlayLink.closest('div'))
  })

  it('footer still renders the copyright notice', () => {
    render(<FooterSection />)
    expect(screen.getByText(/© 2026 DoceOcho Estudio/i)).toBeInTheDocument()
  })

  it('footer still renders the "Córdoba, Argentina" text', () => {
    render(<FooterSection />)
    // There are multiple "Córdoba, Argentina" mentions; at least one should be present
    const matches = screen.getAllByText(/Córdoba, Argentina/i)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('does not break existing navigation links in footer', () => {
    render(<FooterSection />)
    // "Estudio" and "Contacto" appear multiple times (brand + nav); use getAllByText
    const estudioMatches = screen.getAllByText('Estudio')
    expect(estudioMatches.length).toBeGreaterThanOrEqual(1)
    const contactoMatches = screen.getAllByText('Contacto')
    expect(contactoMatches.length).toBeGreaterThanOrEqual(1)
  })
})