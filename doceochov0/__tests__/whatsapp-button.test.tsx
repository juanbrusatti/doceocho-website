/**
 * Tests for whatsapp-button.tsx
 *
 * Scope (PR change):
 *  - WhatsApp button href changed from
 *    wa.me/5493512000000?text=... to wa.me/54935153927563?text=...
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import WhatsAppButton from '../components/whatsapp-button'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...rest}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('WhatsAppButton – updated href (PR change)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the WhatsApp button after the 3500ms delay', () => {
    render(<WhatsAppButton />)
    // Initially not visible
    expect(screen.queryByRole('link', { name: /contactar por whatsapp/i })).not.toBeInTheDocument()

    // Advance past the 3500ms timer
    act(() => {
      vi.advanceTimersByTime(3500)
    })

    expect(screen.getByRole('link', { name: /contactar por whatsapp/i })).toBeInTheDocument()
  })

  it('button href contains the updated phone number 54935153927563', () => {
    render(<WhatsAppButton />)
    act(() => {
      vi.advanceTimersByTime(3500)
    })
    const btn = screen.getByRole('link', { name: /contactar por whatsapp/i })
    expect(btn.getAttribute('href')).toContain('54935153927563')
  })

  it('button href does NOT contain the old number 5493512000000', () => {
    render(<WhatsAppButton />)
    act(() => {
      vi.advanceTimersByTime(3500)
    })
    const btn = screen.getByRole('link', { name: /contactar por whatsapp/i })
    expect(btn.getAttribute('href')).not.toContain('5493512000000')
  })

  it('button href starts with the wa.me URL', () => {
    render(<WhatsAppButton />)
    act(() => {
      vi.advanceTimersByTime(3500)
    })
    const btn = screen.getByRole('link', { name: /contactar por whatsapp/i })
    expect(btn.getAttribute('href')).toMatch(/^https:\/\/wa\.me\//)
  })

  it('button includes pre-filled message text in the URL', () => {
    render(<WhatsAppButton />)
    act(() => {
      vi.advanceTimersByTime(3500)
    })
    const btn = screen.getByRole('link', { name: /contactar por whatsapp/i })
    // The href should have a ?text= query parameter
    expect(btn.getAttribute('href')).toContain('?text=')
  })

  it('button opens in a new tab', () => {
    render(<WhatsAppButton />)
    act(() => {
      vi.advanceTimersByTime(3500)
    })
    const btn = screen.getByRole('link', { name: /contactar por whatsapp/i })
    expect(btn).toHaveAttribute('target', '_blank')
  })

  it('button has rel="noopener noreferrer"', () => {
    render(<WhatsAppButton />)
    act(() => {
      vi.advanceTimersByTime(3500)
    })
    const btn = screen.getByRole('link', { name: /contactar por whatsapp/i })
    expect(btn).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does NOT render before the 3500ms timer fires', () => {
    render(<WhatsAppButton />)
    act(() => {
      vi.advanceTimersByTime(3499)
    })
    expect(screen.queryByRole('link', { name: /contactar por whatsapp/i })).not.toBeInTheDocument()
  })

  it('tooltip "Consultá tu proyecto" appears on mouse enter', () => {
    render(<WhatsAppButton />)
    act(() => {
      vi.advanceTimersByTime(3500)
    })
    const btn = screen.getByRole('link', { name: /contactar por whatsapp/i })
    // Tooltip not initially shown
    expect(screen.queryByText('Consultá tu proyecto')).not.toBeInTheDocument()
    fireEvent.mouseEnter(btn)
    expect(screen.getByText('Consultá tu proyecto')).toBeInTheDocument()
  })

  it('tooltip hides on mouse leave', () => {
    render(<WhatsAppButton />)
    act(() => {
      vi.advanceTimersByTime(3500)
    })
    const btn = screen.getByRole('link', { name: /contactar por whatsapp/i })
    fireEvent.mouseEnter(btn)
    expect(screen.getByText('Consultá tu proyecto')).toBeInTheDocument()
    fireEvent.mouseLeave(btn)
    expect(screen.queryByText('Consultá tu proyecto')).not.toBeInTheDocument()
  })
})