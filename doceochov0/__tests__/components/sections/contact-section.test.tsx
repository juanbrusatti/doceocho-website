/**
 * Tests for contact-section.tsx
 *
 * PR changes:
 * 1. handleSubmit: window.open URL changed from https://wa.me/5493512000000?text=...
 *    to https://wa.me/+54935153927563?text=...
 * 2. Direct WhatsApp link href changed from https://wa.me/5493512000000
 *    to https://wa.me/+54935153927563
 * 3. Displayed phone number text changed from "+54 9 351 200-0000"
 *    to "+54 9 35153927563"
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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
    h2: ({
      children,
      className,
      id,
      ...rest
    }: React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }) => (
      <h2 id={id} className={className} {...rest}>{children}</h2>
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
  },
  useInView: () => true,
}))

import ContactSection from '../../../components/sections/contact-section'

describe('ContactSection', () => {
  let openSpy: jest.SpyInstance

  beforeEach(() => {
    openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
  })

  afterEach(() => {
    openSpy.mockRestore()
    jest.restoreAllMocks()
  })

  describe('Direct WhatsApp contact link', () => {
    it('renders the WhatsApp direct link with updated number +54935153927563', () => {
      render(<ContactSection />)
      const whatsappLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.includes('wa.me'))
      const updatedLink = whatsappLinks.find(
        (link) => link.getAttribute('href') === 'https://wa.me/+54935153927563'
      )
      expect(updatedLink).toBeDefined()
      expect(updatedLink).toBeInTheDocument()
    })

    it('direct WhatsApp link does NOT use old number 5493512000000', () => {
      render(<ContactSection />)
      const oldLinks = screen
        .getAllByRole('link')
        .filter((link) =>
          link.getAttribute('href')?.includes('5493512000000')
        )
      expect(oldLinks).toHaveLength(0)
    })

    it('direct WhatsApp link opens in new tab', () => {
      render(<ContactSection />)
      const whatsappLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.includes('wa.me'))
      const directLink = whatsappLinks.find(
        (link) => link.getAttribute('href') === 'https://wa.me/+54935153927563'
      )
      expect(directLink).toHaveAttribute('target', '_blank')
      expect(directLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Displayed phone number text', () => {
    it('displays the updated phone number text "+54 9 35153927563"', () => {
      render(<ContactSection />)
      expect(screen.getByText('+54 9 35153927563')).toBeInTheDocument()
    })

    it('does NOT display old phone number text "+54 9 351 200-0000"', () => {
      render(<ContactSection />)
      expect(screen.queryByText('+54 9 351 200-0000')).not.toBeInTheDocument()
    })

    it('shows WhatsApp response time label', () => {
      render(<ContactSection />)
      expect(
        screen.getByText('WhatsApp — respuesta inmediata')
      ).toBeInTheDocument()
    })
  })

  describe('Form submission - handleSubmit', () => {
    it('opens WhatsApp with updated number +54935153927563 on form submit', () => {
      render(<ContactSection />)
      const form = document.querySelector('form')!
      fireEvent.submit(form)
      expect(openSpy).toHaveBeenCalledWith(
        expect.stringContaining('wa.me/+54935153927563'),
        '_blank'
      )
    })

    it('opens WhatsApp with the old number NOT used on form submit', () => {
      render(<ContactSection />)
      const form = document.querySelector('form')!
      fireEvent.submit(form)
      const calledUrl = openSpy.mock.calls[0]?.[0] as string
      expect(calledUrl).not.toContain('5493512000000')
    })

    it('includes form data in the WhatsApp message URL when submitted with name', () => {
      render(<ContactSection />)
      const nameInput = screen.getByLabelText(/nombre/i)
      fireEvent.change(nameInput, { target: { name: 'name', value: 'Ana García' } })

      const form = document.querySelector('form')!
      fireEvent.submit(form)

      const calledUrl = openSpy.mock.calls[0]?.[0] as string
      expect(calledUrl).toContain(encodeURIComponent('Ana García'))
    })

    it('uses "un proyecto" as default project type when none selected on submit', () => {
      render(<ContactSection />)
      const form = document.querySelector('form')!
      fireEvent.submit(form)

      const calledUrl = openSpy.mock.calls[0]?.[0] as string
      expect(calledUrl).toContain(encodeURIComponent('un proyecto'))
    })

    it('includes selected project type in the WhatsApp message URL', () => {
      render(<ContactSection />)
      const select = screen.getByLabelText(/tipo de proyecto/i)
      fireEvent.change(select, {
        target: { name: 'projectType', value: 'Cocina a medida' },
      })

      const form = document.querySelector('form')!
      fireEvent.submit(form)

      const calledUrl = openSpy.mock.calls[0]?.[0] as string
      expect(calledUrl).toContain(encodeURIComponent('Cocina a medida'))
    })

    it('shows success state after form submission', () => {
      render(<ContactSection />)
      const form = document.querySelector('form')!
      fireEvent.submit(form)

      expect(screen.getByText('Mensaje enviado.')).toBeInTheDocument()
      expect(
        screen.getByText(/Redirigiste al chat de WhatsApp/)
      ).toBeInTheDocument()
    })

    it('hides the form after successful submission', () => {
      render(<ContactSection />)
      expect(screen.getByRole('button', { name: /Enviar consulta/i })).toBeInTheDocument()

      const form = document.querySelector('form')!
      fireEvent.submit(form)

      expect(screen.queryByRole('button', { name: /Enviar consulta/i })).not.toBeInTheDocument()
    })

    it('WhatsApp URL starts with the correct base URL format', () => {
      render(<ContactSection />)
      const form = document.querySelector('form')!
      fireEvent.submit(form)

      const calledUrl = openSpy.mock.calls[0]?.[0] as string
      expect(calledUrl).toMatch(/^https:\/\/wa\.me\/\+54935153927563\?text=/)
    })

    it('form submission URL-encodes the message', () => {
      render(<ContactSection />)
      const emailInput = screen.getByLabelText(/email/i)
      fireEvent.change(emailInput, {
        target: { name: 'email', value: 'test@example.com' },
      })

      const form = document.querySelector('form')!
      fireEvent.submit(form)

      const calledUrl = openSpy.mock.calls[0]?.[0] as string
      // The @ symbol should be encoded in the URL
      expect(calledUrl).toContain('test%40example.com')
    })
  })

  describe('Form fields', () => {
    it('renders all contact form fields', () => {
      render(<ContactSection />)
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/tipo de proyecto/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument()
    })

    it('handleChange updates form state for name field', () => {
      render(<ContactSection />)
      const nameInput = screen.getByLabelText(/nombre/i)
      fireEvent.change(nameInput, { target: { name: 'name', value: 'Juan' } })
      expect(nameInput).toHaveValue('Juan')
    })

    it('handleChange updates form state for email field', () => {
      render(<ContactSection />)
      const emailInput = screen.getByLabelText(/email/i)
      fireEvent.change(emailInput, {
        target: { name: 'email', value: 'juan@test.com' },
      })
      expect(emailInput).toHaveValue('juan@test.com')
    })

    it('handleChange updates form state for phone field', () => {
      render(<ContactSection />)
      const phoneInput = screen.getByLabelText(/teléfono/i)
      fireEvent.change(phoneInput, {
        target: { name: 'phone', value: '+54 9 35153927563' },
      })
      expect(phoneInput).toHaveValue('+54 9 35153927563')
    })
  })

  describe('Email contact link', () => {
    it('renders the email link', () => {
      render(<ContactSection />)
      const emailLink = screen.getByRole('link', { name: /doce8\.estudio@gmail\.com/i })
      expect(emailLink).toHaveAttribute('href', 'mailto:doce8.estudio@gmail.com')
    })
  })
})