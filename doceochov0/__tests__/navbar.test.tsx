/**
 * Tests for navbar.tsx
 *
 * Scope (PR changes):
 *  - Added next/image Image component with src="/logo-doce8.png" and alt="DoceOcho Estudio Logo"
 *  - Updated logo layout: image + text side-by-side instead of text-only
 *  - Updated WhatsApp CTA URL from 5493512000000 to 54935153927563 (desktop and mobile)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '../components/navbar'

// Mock next/image
vi.mock('next/image', () => ({
  default: vi.fn(({ src, alt, fill, className, ...rest }: {
    src: string
    alt: string
    fill?: boolean
    className?: string
    [key: string]: unknown
  }) => (
    <img
      src={src}
      alt={alt}
      data-fill={fill ? 'true' : undefined}
      className={className}
      {...rest}
    />
  )),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, className, 'aria-label': ariaLabel }: {
    children: React.ReactNode
    href: string
    className?: string
    'aria-label'?: string
  }) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, className, ...rest }: React.HTMLAttributes<HTMLElement>) => (
      <header className={className} {...rest}>{children}</header>
    ),
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...rest}>{children}</div>
    ),
    span: ({ children, className, ...rest }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className} {...rest}>{children}</span>
    ),
    button: ({ children, className, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button className={className} onClick={onClick} {...rest}>{children}</button>
    ),
    a: ({ children, href, className, target, rel, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a href={href} className={className} target={target} rel={rel} {...rest}>{children}</a>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Provide scrollY and addEventListener for the scroll handler
const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

describe('Navbar – logo Image (PR change)', () => {
  it('renders the logo image with src="/logo-doce8.png"', () => {
    render(<Navbar />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo-doce8.png')
  })

  it('renders the logo image with alt="DoceOcho Estudio Logo"', () => {
    render(<Navbar />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders the logo image with fill prop', () => {
    render(<Navbar />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toHaveAttribute('data-fill', 'true')
  })

  it('renders the logo image with object-contain class', () => {
    render(<Navbar />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toHaveClass('object-contain')
  })

  it('renders the logo alongside the DoceOcho and Estudio text', () => {
    render(<Navbar />)
    expect(screen.getByAltText('DoceOcho Estudio Logo')).toBeInTheDocument()
    expect(screen.getByText('DoceOcho')).toBeInTheDocument()
    // "Estudio" appears both in the logo span and as a nav button
    const estudioMatches = screen.getAllByText('Estudio')
    expect(estudioMatches.length).toBeGreaterThanOrEqual(1)
  })

  it('logo is wrapped in a link to "/"', () => {
    render(<Navbar />)
    const logoLink = screen.getByRole('link', { name: /DoceOcho Studio - Ir al inicio/i })
    expect(logoLink).toHaveAttribute('href', '/')
  })
})

describe('Navbar – WhatsApp URL (PR change)', () => {
  it('desktop WhatsApp CTA link points to updated number 54935153927563', () => {
    render(<Navbar />)
    const waLinks = screen.getAllByRole('link', { name: /whatsapp/i })
    // At least one link should contain the updated number
    const hasUpdatedUrl = waLinks.some((link) =>
      link.getAttribute('href')?.includes('54935153927563')
    )
    expect(hasUpdatedUrl).toBe(true)
  })

  it('desktop WhatsApp link does NOT contain the old number 5493512000000', () => {
    render(<Navbar />)
    const waLinks = screen.getAllByRole('link', { name: /whatsapp/i })
    const hasOldUrl = waLinks.some((link) =>
      link.getAttribute('href')?.includes('5493512000000')
    )
    expect(hasOldUrl).toBe(false)
  })

  it('desktop WhatsApp link opens in a new tab', () => {
    render(<Navbar />)
    const waLinks = screen.getAllByRole('link', { name: /whatsapp/i })
    waLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  it('desktop WhatsApp link has rel="noopener noreferrer"', () => {
    render(<Navbar />)
    const waLinks = screen.getAllByRole('link', { name: /whatsapp/i })
    waLinks.forEach((link) => {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('mobile menu WhatsApp link points to updated number 54935153927563', () => {
    render(<Navbar />)
    // Open mobile menu
    const burger = screen.getByRole('button', { name: /abrir menú/i })
    fireEvent.click(burger)
    const waLinks = screen.getAllByRole('link', { name: /whatsapp/i })
    const allUpdated = waLinks.every((link) =>
      link.getAttribute('href')?.includes('54935153927563')
    )
    expect(allUpdated).toBe(true)
  })

  it('all WhatsApp links use wa.me domain', () => {
    render(<Navbar />)
    const burger = screen.getByRole('button', { name: /abrir menú/i })
    fireEvent.click(burger)
    const waLinks = screen.getAllByRole('link', { name: /whatsapp/i })
    waLinks.forEach((link) => {
      expect(link.getAttribute('href')).toMatch(/^https:\/\/wa\.me\//)
    })
  })
})

describe('Navbar – mobile menu burger', () => {
  it('toggles menu open/close via burger button', () => {
    render(<Navbar />)
    const burgerOpen = screen.getByRole('button', { name: /abrir menú/i })
    fireEvent.click(burgerOpen)
    // After open, aria-label changes to close
    const burgerClose = screen.getByRole('button', { name: /cerrar menú/i })
    expect(burgerClose).toBeInTheDocument()
    fireEvent.click(burgerClose)
    expect(screen.getByRole('button', { name: /abrir menú/i })).toBeInTheDocument()
  })
})