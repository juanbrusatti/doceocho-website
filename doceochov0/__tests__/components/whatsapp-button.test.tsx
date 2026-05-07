/**
 * Tests for whatsapp-button.tsx
 *
 * PR changes:
 * WhatsApp href changed from:
 *   https://wa.me/5493512000000?text=Hola%2C%20me%20interesa%20consultar%20sobre%20un%20proyecto.
 * to:
 *   https://wa.me/54935153927563?text=Hola%2C%20me%20interesa%20consultar%20sobre%20un%20proyecto.
 */

import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
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
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import WhatsAppButton from '../../components/whatsapp-button'

describe('WhatsAppButton', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  // Helper: advance timers to make the button visible (it appears after 3500ms)
  const makeVisible = () => {
    act(() => {
      jest.advanceTimersByTime(3500)
    })
  }

  describe('WhatsApp URL', () => {
    it('renders the WhatsApp button link with updated phone number 54935153927563', () => {
      render(<WhatsAppButton />)
      makeVisible()

      const link = screen.getByRole('link', { name: /contactar por whatsapp/i })
      expect(link).toHaveAttribute(
        'href',
        'https://wa.me/54935153927563?text=Hola%2C%20me%20interesa%20consultar%20sobre%20un%20proyecto.'
      )
    })

    it('WhatsApp link does NOT use old phone number 5493512000000', () => {
      render(<WhatsAppButton />)
      makeVisible()

      const link = screen.getByRole('link', { name: /contactar por whatsapp/i })
      expect(link.getAttribute('href')).not.toContain('5493512000000')
    })

    it('WhatsApp link href includes the pre-filled message text', () => {
      render(<WhatsAppButton />)
      makeVisible()

      const link = screen.getByRole('link', { name: /contactar por whatsapp/i })
      const href = link.getAttribute('href')!
      expect(href).toContain('text=Hola')
      expect(href).toContain('proyecto')
    })

    it('WhatsApp link opens in a new tab', () => {
      render(<WhatsAppButton />)
      makeVisible()

      const link = screen.getByRole('link', { name: /contactar por whatsapp/i })
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('WhatsApp link has rel="noopener noreferrer"', () => {
      render(<WhatsAppButton />)
      makeVisible()

      const link = screen.getByRole('link', { name: /contactar por whatsapp/i })
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('WhatsApp href starts with https://wa.me/54935153927563', () => {
      render(<WhatsAppButton />)
      makeVisible()

      const link = screen.getByRole('link', { name: /contactar por whatsapp/i })
      expect(link.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/54935153927563/)
    })
  })

  describe('Visibility behavior', () => {
    it('is not visible before 3500ms', () => {
      render(<WhatsAppButton />)
      // Before timer fires
      expect(
        screen.queryByRole('link', { name: /contactar por whatsapp/i })
      ).not.toBeInTheDocument()
    })

    it('becomes visible after 3500ms timer', () => {
      render(<WhatsAppButton />)
      makeVisible()
      expect(
        screen.getByRole('link', { name: /contactar por whatsapp/i })
      ).toBeInTheDocument()
    })

    it('button has correct aria-label', () => {
      render(<WhatsAppButton />)
      makeVisible()
      expect(
        screen.getByRole('link', { name: 'Contactar por WhatsApp' })
      ).toBeInTheDocument()
    })
  })

  describe('Tooltip behavior', () => {
    it('tooltip is not shown initially', () => {
      render(<WhatsAppButton />)
      makeVisible()
      expect(screen.queryByText('Consultá tu proyecto')).not.toBeInTheDocument()
    })

    it('shows tooltip on mouse enter', () => {
      render(<WhatsAppButton />)
      makeVisible()

      const link = screen.getByRole('link', { name: /contactar por whatsapp/i })
      fireEvent.mouseEnter(link)
      expect(screen.getByText('Consultá tu proyecto')).toBeInTheDocument()
    })

    it('hides tooltip on mouse leave', () => {
      render(<WhatsAppButton />)
      makeVisible()

      const link = screen.getByRole('link', { name: /contactar por whatsapp/i })
      fireEvent.mouseEnter(link)
      expect(screen.getByText('Consultá tu proyecto')).toBeInTheDocument()

      fireEvent.mouseLeave(link)
      expect(screen.queryByText('Consultá tu proyecto')).not.toBeInTheDocument()
    })
  })

  describe('Regression: no old phone number in any rendered link', () => {
    it('no anchor in the component has old phone number 5493512000000 in href', () => {
      render(<WhatsAppButton />)
      makeVisible()

      const allLinks = screen.getAllByRole('link')
      allLinks.forEach((link) => {
        expect(link.getAttribute('href')).not.toContain('5493512000000')
      })
    })
  })
})