/**
 * Tests for footer-section.tsx
 *
 * PR changes:
 * Added a new "Desarrollado con ❤️ por dlay.com.ar" link in the bottom bar:
 * - href="https://dlay.com.ar"
 * - target="_blank"
 * - rel="noopener noreferrer"
 * - className includes hover transition styling
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
      <div className={className} {...rest}>{children}</div>
    ),
    p: ({
      children,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLParagraphElement> & { children?: React.ReactNode }) => (
      <p className={className} {...rest}>{children}</p>
    ),
    span: ({
      children,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) => (
      <span className={className} {...rest}>{children}</span>
    ),
    nav: ({
      children,
      className,
      'aria-label': ariaLabel,
      ...rest
    }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode; 'aria-label'?: string }) => (
      <nav className={className} aria-label={ariaLabel} {...rest}>{children}</nav>
    ),
  },
  useInView: () => true,
}))

import FooterSection from '../../../components/sections/footer-section'

describe('FooterSection', () => {
  describe('New dlay.com.ar attribution link', () => {
    it('renders the "Desarrollado con" attribution link', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', {
        name: /desarrollado con.*dlay\.com\.ar/i,
      })
      expect(dlayLink).toBeInTheDocument()
    })

    it('attribution link has correct href to https://dlay.com.ar', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', {
        name: /desarrollado con.*dlay\.com\.ar/i,
      })
      expect(dlayLink).toHaveAttribute('href', 'https://dlay.com.ar')
    })

    it('attribution link opens in a new tab (target="_blank")', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', {
        name: /desarrollado con.*dlay\.com\.ar/i,
      })
      expect(dlayLink).toHaveAttribute('target', '_blank')
    })

    it('attribution link has rel="noopener noreferrer" for security', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', {
        name: /desarrollado con.*dlay\.com\.ar/i,
      })
      expect(dlayLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('attribution link text contains "dlay.com.ar"', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', {
        name: /desarrollado con.*dlay\.com\.ar/i,
      })
      expect(dlayLink.textContent).toContain('dlay.com.ar')
    })

    it('attribution link text contains "Desarrollado"', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', {
        name: /desarrollado con.*dlay\.com\.ar/i,
      })
      expect(dlayLink.textContent).toContain('Desarrollado')
    })

    it('attribution link appears in the bottom bar section', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', {
        name: /desarrollado con.*dlay\.com\.ar/i,
      })
      // The link should be inside the bottom bar (which is a flex row with copyright)
      const copyrightText = screen.getByText(/© 2026 DoceOcho Estudio/)
      const bottomBar = copyrightText.closest('div')
      expect(bottomBar).toContainElement(dlayLink)
    })

    it('attribution link has hover transition classes', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', {
        name: /desarrollado con.*dlay\.com\.ar/i,
      })
      expect(dlayLink).toHaveClass('transition-colors')
    })
  })

  describe('Existing bottom bar content', () => {
    it('still renders the copyright notice', () => {
      render(<FooterSection />)
      expect(
        screen.getByText(/© 2026 DoceOcho Estudio\. Todos los derechos reservados\./)
      ).toBeInTheDocument()
    })

    it('still renders the "Córdoba, Argentina" location text in the bottom bar', () => {
      render(<FooterSection />)
      // There may be more than one "Córdoba, Argentina" in the footer (brand section + bottom bar)
      const texts = screen.getAllByText(/Córdoba, Argentina/)
      expect(texts.length).toBeGreaterThanOrEqual(1)
    })

    it('renders the footer landmark', () => {
      render(<FooterSection />)
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
    })
  })

  describe('Bottom bar has exactly three items after the PR change', () => {
    it('bottom bar contains copyright, location, and attribution link', () => {
      render(<FooterSection />)
      const copyright = screen.getByText(/© 2026 DoceOcho Estudio/)
      const bottomBar = copyright.closest('div')!

      const dlayLink = screen.getByRole('link', {
        name: /desarrollado con.*dlay\.com\.ar/i,
      })
      expect(bottomBar).toContainElement(dlayLink)
    })
  })

  describe('Regression: dlay link is unique in the page', () => {
    it('renders exactly one dlay attribution link', () => {
      render(<FooterSection />)
      const dlayLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href') === 'https://dlay.com.ar')
      expect(dlayLinks).toHaveLength(1)
    })
  })
})