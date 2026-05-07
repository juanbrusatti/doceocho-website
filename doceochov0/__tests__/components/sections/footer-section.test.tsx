import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import FooterSection from '../../../components/sections/footer-section'

jest.mock('framer-motion')

const DLAY_URL = 'https://dlay.com.ar'
const DLAY_LINK_TEXT = 'Desarrollado con ❤️ por dlay.com.ar'

describe('FooterSection', () => {
  describe('dlay.com.ar attribution link (new in PR)', () => {
    it('renders the dlay.com.ar attribution link', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', { name: /desarrollado con/i })
      expect(dlayLink).toBeInTheDocument()
    })

    it('dlay.com.ar link has correct href', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', { name: /desarrollado con/i })
      expect(dlayLink).toHaveAttribute('href', DLAY_URL)
    })

    it('dlay.com.ar link opens in a new tab', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', { name: /desarrollado con/i })
      expect(dlayLink).toHaveAttribute('target', '_blank')
    })

    it('dlay.com.ar link has rel noopener noreferrer for security', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', { name: /desarrollado con/i })
      expect(dlayLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('dlay.com.ar link displays correct text with heart emoji', () => {
      render(<FooterSection />)
      expect(screen.getByText(DLAY_LINK_TEXT)).toBeInTheDocument()
    })

    it('dlay.com.ar link contains "dlay.com.ar" in its text', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', { name: /desarrollado con/i })
      expect(dlayLink.textContent).toContain('dlay.com.ar')
    })

    it('dlay.com.ar link is in the bottom bar section', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', { name: /desarrollado con/i })
      // The link should be near the copyright text
      const bottomBar = dlayLink.closest('div')
      expect(bottomBar).toBeInTheDocument()
    })

    it('copyright text is present alongside dlay.com.ar attribution', () => {
      render(<FooterSection />)
      expect(screen.getByText(/© 2026 DoceOcho Estudio/i)).toBeInTheDocument()
      expect(screen.getByText(DLAY_LINK_TEXT)).toBeInTheDocument()
    })

    it('Córdoba, Argentina text is present in bottom bar', () => {
      render(<FooterSection />)
      // There may be multiple "Córdoba, Argentina" texts (footer brand + bottom bar)
      const cordobaElements = screen.getAllByText('Córdoba, Argentina')
      expect(cordobaElements.length).toBeGreaterThanOrEqual(1)
    })

    it('dlay.com.ar link has hover transition class', () => {
      render(<FooterSection />)
      const dlayLink = screen.getByRole('link', { name: /desarrollado con/i })
      expect(dlayLink.className).toContain('transition-colors')
    })
  })

  describe('Existing footer structure', () => {
    it('renders the footer element', () => {
      render(<FooterSection />)
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
    })

    it('footer has correct aria-label', () => {
      render(<FooterSection />)
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveAttribute('aria-label', 'Pie de página')
    })

    it('renders DoceOcho Estudio brand name', () => {
      render(<FooterSection />)
      expect(screen.getAllByText(/DoceOcho Estudio/i).length).toBeGreaterThanOrEqual(1)
    })
  })
})