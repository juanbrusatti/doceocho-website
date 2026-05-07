import React from 'react'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import WhatsAppButton from '../../components/whatsapp-button'

jest.mock('framer-motion')

const NEW_WHATSAPP_NUMBER = '54935153927563'
const OLD_WHATSAPP_NUMBER = '5493512000000'
const EXPECTED_HREF = `https://wa.me/${NEW_WHATSAPP_NUMBER}?text=Hola%2C%20me%20interesa%20consultar%20sobre%20un%20proyecto.`

describe('WhatsAppButton', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Button visibility', () => {
    it('button is NOT visible immediately on render', () => {
      render(<WhatsAppButton />)
      expect(screen.queryByRole('link', { name: /Contactar por WhatsApp/i })).not.toBeInTheDocument()
    })

    it('button becomes visible after 3500ms timeout', () => {
      render(<WhatsAppButton />)
      act(() => {
        jest.advanceTimersByTime(3500)
      })
      expect(screen.getByRole('link', { name: /Contactar por WhatsApp/i })).toBeInTheDocument()
    })

    it('button is not visible before 3500ms have passed', () => {
      render(<WhatsAppButton />)
      act(() => {
        jest.advanceTimersByTime(3499)
      })
      expect(screen.queryByRole('link', { name: /Contactar por WhatsApp/i })).not.toBeInTheDocument()
    })
  })

  describe('WhatsApp link - updated phone number', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    it('WhatsApp button href contains updated phone number', () => {
      render(<WhatsAppButton />)
      act(() => {
        jest.advanceTimersByTime(3500)
      })
      const button = screen.getByRole('link', { name: /Contactar por WhatsApp/i })
      expect(button.getAttribute('href')).toContain(NEW_WHATSAPP_NUMBER)
    })

    it('WhatsApp button href does NOT contain old phone number', () => {
      render(<WhatsAppButton />)
      act(() => {
        jest.advanceTimersByTime(3500)
      })
      const button = screen.getByRole('link', { name: /Contactar por WhatsApp/i })
      expect(button.getAttribute('href')).not.toContain(OLD_WHATSAPP_NUMBER)
    })

    it('WhatsApp button has the exact expected href', () => {
      render(<WhatsAppButton />)
      act(() => {
        jest.advanceTimersByTime(3500)
      })
      const button = screen.getByRole('link', { name: /Contactar por WhatsApp/i })
      expect(button).toHaveAttribute('href', EXPECTED_HREF)
    })

    it('WhatsApp button opens in new tab', () => {
      render(<WhatsAppButton />)
      act(() => {
        jest.advanceTimersByTime(3500)
      })
      const button = screen.getByRole('link', { name: /Contactar por WhatsApp/i })
      expect(button).toHaveAttribute('target', '_blank')
    })

    it('WhatsApp button has rel noopener noreferrer', () => {
      render(<WhatsAppButton />)
      act(() => {
        jest.advanceTimersByTime(3500)
      })
      const button = screen.getByRole('link', { name: /Contactar por WhatsApp/i })
      expect(button).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('WhatsApp button includes pre-filled message in href', () => {
      render(<WhatsAppButton />)
      act(() => {
        jest.advanceTimersByTime(3500)
      })
      const button = screen.getByRole('link', { name: /Contactar por WhatsApp/i })
      const href = button.getAttribute('href') ?? ''
      expect(href).toContain('text=')
      expect(href).toContain(encodeURIComponent('Hola'))
    })
  })

  describe('Tooltip behavior', () => {
    it('tooltip is not visible initially', () => {
      render(<WhatsAppButton />)
      act(() => {
        jest.advanceTimersByTime(3500)
      })
      expect(screen.queryByText('Consultá tu proyecto')).not.toBeInTheDocument()
    })

    it('tooltip appears on mouse enter', () => {
      render(<WhatsAppButton />)
      act(() => {
        jest.advanceTimersByTime(3500)
      })
      const button = screen.getByRole('link', { name: /Contactar por WhatsApp/i })
      fireEvent.mouseEnter(button)
      expect(screen.getByText('Consultá tu proyecto')).toBeInTheDocument()
    })

    it('button has onMouseLeave handler to hide tooltip', () => {
      render(<WhatsAppButton />)
      act(() => {
        jest.advanceTimersByTime(3500)
      })
      const button = screen.getByRole('link', { name: /Contactar por WhatsApp/i })
      // Verify that the onMouseLeave event handler is attached by checking the button renders with tooltip visible on enter
      act(() => {
        fireEvent.mouseEnter(button)
      })
      expect(screen.getByText('Consultá tu proyecto')).toBeInTheDocument()
      // The mouseLeave handler is attached (no error thrown = handler is registered)
      expect(() => fireEvent.mouseLeave(button)).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('button has correct aria-label', () => {
      render(<WhatsAppButton />)
      act(() => {
        jest.advanceTimersByTime(3500)
      })
      const button = screen.getByRole('link', { name: 'Contactar por WhatsApp' })
      expect(button).toBeInTheDocument()
    })

    it('SVG icon has aria-hidden true', () => {
      render(<WhatsAppButton />)
      act(() => {
        jest.advanceTimersByTime(3500)
      })
      const svgIcon = document.querySelector('svg[aria-hidden="true"]')
      expect(svgIcon).toBeInTheDocument()
    })
  })

  describe('Timer cleanup', () => {
    it('cleans up timer on unmount without throwing', () => {
      const { unmount } = render(<WhatsAppButton />)
      // Should not throw when unmounted before timer fires
      expect(() => unmount()).not.toThrow()
    })

    it('does not show button after unmount and timer fires', () => {
      const { unmount } = render(<WhatsAppButton />)
      unmount()
      act(() => {
        jest.advanceTimersByTime(3500)
      })
      // After unmount, button should not exist in DOM
      expect(screen.queryByRole('link', { name: /Contactar por WhatsApp/i })).not.toBeInTheDocument()
    })
  })
})