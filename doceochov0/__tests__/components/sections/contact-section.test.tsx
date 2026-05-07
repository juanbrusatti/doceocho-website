import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ContactSection from '../../../components/sections/contact-section'

jest.mock('framer-motion')

const NEW_WHATSAPP_NUMBER = '+54935153927563'
const NEW_WHATSAPP_NUMBER_NO_PLUS = '54935153927563'
const OLD_WHATSAPP_NUMBER = '5493512000000'
const NEW_PHONE_DISPLAY = '+54 9 35153927563'
const OLD_PHONE_DISPLAY = '+54 9 351 200-0000'

describe('ContactSection', () => {
  beforeEach(() => {
    // Mock window.open to track WhatsApp redirect calls
    jest.spyOn(window, 'open').mockImplementation(() => null)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('WhatsApp contact link - updated number', () => {
    it('renders WhatsApp contact link with updated phone number', () => {
      render(<ContactSection />)
      const waLink = screen.getByRole('link', { name: /whatsapp/i })
      expect(waLink).toHaveAttribute('href', `https://wa.me/${NEW_WHATSAPP_NUMBER}`)
    })

    it('WhatsApp contact link does NOT contain old phone number', () => {
      render(<ContactSection />)
      const waLink = screen.getByRole('link', { name: /whatsapp/i })
      expect(waLink.getAttribute('href')).not.toContain(OLD_WHATSAPP_NUMBER)
    })

    it('WhatsApp contact link opens in new tab', () => {
      render(<ContactSection />)
      const waLink = screen.getByRole('link', { name: /whatsapp/i })
      expect(waLink).toHaveAttribute('target', '_blank')
      expect(waLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Phone number display - updated text', () => {
    it('displays updated phone number text', () => {
      render(<ContactSection />)
      expect(screen.getByText(NEW_PHONE_DISPLAY)).toBeInTheDocument()
    })

    it('does NOT display old phone number text', () => {
      render(<ContactSection />)
      expect(screen.queryByText(OLD_PHONE_DISPLAY)).not.toBeInTheDocument()
    })

    it('displays WhatsApp response note', () => {
      render(<ContactSection />)
      expect(screen.getByText('WhatsApp — respuesta inmediata')).toBeInTheDocument()
    })
  })

  describe('Form submission - updated WhatsApp URL', () => {
    it('form submission opens WhatsApp with updated phone number', () => {
      render(<ContactSection />)

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/nombre/i), {
        target: { name: 'name', value: 'Juan Pérez' },
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { name: 'email', value: 'juan@test.com' },
      })

      // Submit the form
      fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

      expect(window.open).toHaveBeenCalledTimes(1)
      const [calledUrl] = (window.open as jest.Mock).mock.calls[0]
      expect(calledUrl).toContain(`https://wa.me/${NEW_WHATSAPP_NUMBER}`)
    })

    it('form submission URL does NOT contain old phone number', () => {
      render(<ContactSection />)

      fireEvent.change(screen.getByLabelText(/nombre/i), {
        target: { name: 'name', value: 'Test User' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

      const [calledUrl] = (window.open as jest.Mock).mock.calls[0]
      expect(calledUrl).not.toContain(OLD_WHATSAPP_NUMBER)
    })

    it('form submission opens link in new tab', () => {
      render(<ContactSection />)

      fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

      expect(window.open).toHaveBeenCalledWith(expect.any(String), '_blank')
    })

    it('form submission includes user name in WhatsApp message', () => {
      render(<ContactSection />)

      const testName = 'María García'
      fireEvent.change(screen.getByLabelText(/nombre/i), {
        target: { name: 'name', value: testName },
      })
      fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

      const [calledUrl] = (window.open as jest.Mock).mock.calls[0]
      expect(calledUrl).toContain(encodeURIComponent(testName))
    })

    it('form submission includes email in WhatsApp message', () => {
      render(<ContactSection />)

      const testEmail = 'test@example.com'
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { name: 'email', value: testEmail },
      })
      fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

      const [calledUrl] = (window.open as jest.Mock).mock.calls[0]
      expect(calledUrl).toContain(encodeURIComponent(testEmail))
    })

    it('shows success state after form submission', () => {
      render(<ContactSection />)

      fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

      expect(screen.getByText('Mensaje enviado.')).toBeInTheDocument()
      expect(screen.getByText(/Redirigiste al chat de WhatsApp/i)).toBeInTheDocument()
    })

    it('hides form after submission', () => {
      render(<ContactSection />)

      fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

      expect(screen.queryByRole('button', { name: /enviar consulta/i })).not.toBeInTheDocument()
    })
  })

  describe('Form field state management', () => {
    it('updates name field on change', () => {
      render(<ContactSection />)
      const nameInput = screen.getByLabelText(/nombre/i) as HTMLInputElement
      fireEvent.change(nameInput, { target: { name: 'name', value: 'Test Name' } })
      expect(nameInput.value).toBe('Test Name')
    })

    it('updates email field on change', () => {
      render(<ContactSection />)
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
      fireEvent.change(emailInput, { target: { name: 'email', value: 'test@test.com' } })
      expect(emailInput.value).toBe('test@test.com')
    })

    it('updates projectType on select change', () => {
      render(<ContactSection />)
      const select = screen.getByLabelText(/tipo de proyecto/i) as HTMLSelectElement
      fireEvent.change(select, { target: { name: 'projectType', value: 'Cocina a medida' } })
      expect(select.value).toBe('Cocina a medida')
    })

    it('uses projectType in WhatsApp message when selected', () => {
      render(<ContactSection />)

      const select = screen.getByLabelText(/tipo de proyecto/i)
      fireEvent.change(select, {
        target: { name: 'projectType', value: 'Arquitectura residencial' },
      })
      fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

      const [calledUrl] = (window.open as jest.Mock).mock.calls[0]
      expect(calledUrl).toContain(encodeURIComponent('Arquitectura residencial'))
    })

    it('uses fallback "un proyecto" in WhatsApp message when no project type selected', () => {
      render(<ContactSection />)

      fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

      const [calledUrl] = (window.open as jest.Mock).mock.calls[0]
      expect(calledUrl).toContain(encodeURIComponent('un proyecto'))
    })
  })

  describe('Other contact information', () => {
    it('renders email contact link', () => {
      render(<ContactSection />)
      const emailLink = screen.getByRole('link', { name: /doce8.estudio@gmail.com/i })
      expect(emailLink).toHaveAttribute('href', 'mailto:doce8.estudio@gmail.com')
    })

    it('renders section with correct id', () => {
      const { container } = render(<ContactSection />)
      const section = container.querySelector('#contacto')
      expect(section).toBeInTheDocument()
    })
  })
})