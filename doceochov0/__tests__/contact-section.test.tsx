/**
 * Tests for contact-section.tsx
 *
 * Scope (PR changes):
 *  - handleSubmit: URL changed from wa.me/5493512000000 to wa.me/+54935153927563
 *  - WhatsApp anchor href changed from wa.me/5493512000000 to wa.me/+54935153927563
 *  - Phone display text changed from "+54 9 351 200-0000" to "+54 9 35153927563"
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ContactSection from '../components/sections/contact-section'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...rest}>{children}</div>
    ),
    h2: ({ children, className, id, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className={className} id={id} {...rest}>{children}</h2>
    ),
    p: ({ children, className, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={className} {...rest}>{children}</p>
    ),
    span: ({ children, className, ...rest }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className} {...rest}>{children}</span>
    ),
  },
  useInView: () => true,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('ContactSection – WhatsApp contact link (PR change)', () => {
  it('renders a WhatsApp link with the updated phone number href', () => {
    render(<ContactSection />)
    const waLink = screen.getByRole('link', { name: /whatsapp/i })
    expect(waLink).toHaveAttribute('href', 'https://wa.me/+54935153927563')
  })

  it('WhatsApp link does NOT use old number 5493512000000', () => {
    render(<ContactSection />)
    const waLink = screen.getByRole('link', { name: /whatsapp/i })
    expect(waLink.getAttribute('href')).not.toContain('5493512000000')
  })

  it('WhatsApp link opens in a new tab', () => {
    render(<ContactSection />)
    const waLink = screen.getByRole('link', { name: /whatsapp/i })
    expect(waLink).toHaveAttribute('target', '_blank')
  })

  it('WhatsApp link has rel="noopener noreferrer"', () => {
    render(<ContactSection />)
    const waLink = screen.getByRole('link', { name: /whatsapp/i })
    expect(waLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('ContactSection – phone number display (PR change)', () => {
  it('displays the updated phone number text "+54 9 35153927563"', () => {
    render(<ContactSection />)
    expect(screen.getByText('+54 9 35153927563')).toBeInTheDocument()
  })

  it('does NOT display the old phone number "+54 9 351 200-0000"', () => {
    render(<ContactSection />)
    expect(screen.queryByText('+54 9 351 200-0000')).not.toBeInTheDocument()
  })
})

describe('ContactSection – form submit opens WhatsApp (PR change)', () => {
  let openSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
  })

  afterEach(() => {
    openSpy.mockRestore()
  })

  it('calls window.open with the updated WhatsApp URL on submit', () => {
    render(<ContactSection />)

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { name: 'name', value: 'María García' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: 'email', value: 'maria@example.com' },
    })

    // Submit
    fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

    expect(openSpy).toHaveBeenCalledOnce()
    const calledUrl: string = openSpy.mock.calls[0][0] as string
    expect(calledUrl).toContain('https://wa.me/+54935153927563')
  })

  it('window.open URL does NOT contain the old number 5493512000000', () => {
    render(<ContactSection />)

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { name: 'name', value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: 'email', value: 'test@example.com' },
    })

    fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

    const calledUrl: string = openSpy.mock.calls[0][0] as string
    expect(calledUrl).not.toContain('5493512000000')
  })

  it('opens WhatsApp in a new tab (_blank)', () => {
    render(<ContactSection />)

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { name: 'name', value: 'Test' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: 'email', value: 'test@example.com' },
    })

    fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

    expect(openSpy.mock.calls[0][1]).toBe('_blank')
  })

  it('includes the user name in the WhatsApp message URL', () => {
    render(<ContactSection />)

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { name: 'name', value: 'Carlos Rodríguez' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: 'email', value: 'carlos@example.com' },
    })

    fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

    const calledUrl: string = openSpy.mock.calls[0][0] as string
    expect(calledUrl).toContain(encodeURIComponent('Carlos Rodríguez'))
  })

  it('includes the user email in the WhatsApp message URL', () => {
    render(<ContactSection />)

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { name: 'name', value: 'Ana' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: 'email', value: 'ana@studio.com' },
    })

    fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

    const calledUrl: string = openSpy.mock.calls[0][0] as string
    expect(calledUrl).toContain(encodeURIComponent('ana@studio.com'))
  })

  it('uses "un proyecto" as fallback when projectType is empty', () => {
    render(<ContactSection />)

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { name: 'name', value: 'Luis' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: 'email', value: 'luis@example.com' },
    })
    // Leave projectType empty (default)

    fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

    const calledUrl: string = openSpy.mock.calls[0][0] as string
    expect(calledUrl).toContain(encodeURIComponent('un proyecto'))
  })

  it('shows confirmation message after submission', () => {
    render(<ContactSection />)

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { name: 'name', value: 'Test' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: 'email', value: 'test@example.com' },
    })

    fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

    expect(screen.getByText('Mensaje enviado.')).toBeInTheDocument()
  })

  it('hides the form after submission (setSent = true)', () => {
    render(<ContactSection />)

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { name: 'name', value: 'Test' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: 'email', value: 'test@example.com' },
    })

    fireEvent.submit(screen.getByRole('button', { name: /enviar consulta/i }).closest('form')!)

    expect(screen.queryByRole('button', { name: /enviar consulta/i })).not.toBeInTheDocument()
  })
})

describe('ContactSection – form field interaction', () => {
  it('updates name field on change', () => {
    render(<ContactSection />)
    const nameInput = screen.getByLabelText(/nombre/i) as HTMLInputElement
    fireEvent.change(nameInput, { target: { name: 'name', value: 'Juana' } })
    expect(nameInput.value).toBe('Juana')
  })

  it('updates email field on change', () => {
    render(<ContactSection />)
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    fireEvent.change(emailInput, { target: { name: 'email', value: 'juana@test.com' } })
    expect(emailInput.value).toBe('juana@test.com')
  })
})