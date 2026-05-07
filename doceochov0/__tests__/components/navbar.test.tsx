/**
 * Tests for navbar.tsx
 *
 * PR changes:
 * 1. Added next/image <Image> component with logo (src="/logo-doce8.png")
 * 2. Restructured logo layout: now image + text side-by-side (gap-3, items-center)
 * 3. Updated WhatsApp URL from 5493512000000 to 54935153927563 (both desktop CTA and mobile menu)
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    header: ({
      children,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => (
      <header className={className} {...rest}>{children}</header>
    ),
    div: ({
      children,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
      <div className={className} {...rest}>{children}</div>
    ),
    button: ({
      children,
      className,
      onClick,
      ...rest
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => (
      <button className={className} onClick={onClick} {...rest}>{children}</button>
    ),
    a: ({
      children,
      className,
      href,
      target,
      rel,
      ...rest
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children?: React.ReactNode }) => (
      <a className={className} href={href} target={target} rel={rel} {...rest}>{children}</a>
    ),
    span: ({
      children,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) => (
      <span className={className} {...rest}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill,
    className,
  }: {
    src: string
    alt: string
    fill?: boolean
    className?: string
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      data-fill={fill ? 'true' : undefined}
      className={className}
    />
  ),
}))

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    className,
    'aria-label': ariaLabel,
  }: {
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

import Navbar from '../../components/navbar'

describe('Navbar', () => {
  beforeEach(() => {
    // Mock scroll event listener
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
    jest.spyOn(window, 'addEventListener')
    jest.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Logo image', () => {
    it('renders the logo image with correct src', () => {
      render(<Navbar />)
      const logo = screen.getByAltText('DoceOcho Estudio Logo')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', '/logo-doce8.png')
    })

    it('renders the logo image with alt text', () => {
      render(<Navbar />)
      expect(screen.getByAltText('DoceOcho Estudio Logo')).toBeInTheDocument()
    })

    it('renders the logo image with fill attribute', () => {
      render(<Navbar />)
      const logo = screen.getByAltText('DoceOcho Estudio Logo')
      expect(logo).toHaveAttribute('data-fill', 'true')
    })

    it('renders the logo image with object-contain class', () => {
      render(<Navbar />)
      const logo = screen.getByAltText('DoceOcho Estudio Logo')
      expect(logo).toHaveClass('object-contain')
    })

    it('wraps the logo image in a relative positioned container', () => {
      render(<Navbar />)
      const logo = screen.getByAltText('DoceOcho Estudio Logo')
      const container = logo.parentElement
      expect(container).toHaveClass('relative')
      expect(container).toHaveClass('w-10')
      expect(container).toHaveClass('h-10')
    })
  })

  describe('Logo layout structure', () => {
    it('renders the logo link with side-by-side layout (items-center and gap-3)', () => {
      render(<Navbar />)
      const logoLink = screen.getByLabelText('DoceOcho Studio - Ir al inicio')
      expect(logoLink).toHaveClass('flex')
      expect(logoLink).toHaveClass('items-center')
      expect(logoLink).toHaveClass('gap-3')
    })

    it('renders DoceOcho and Estudio text labels alongside the logo image', () => {
      render(<Navbar />)
      expect(screen.getByText('DoceOcho')).toBeInTheDocument()
      // "Estudio" appears in both the logo tagline and the nav link — confirm at least one exists
      expect(screen.getAllByText('Estudio').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByAltText('DoceOcho Estudio Logo')).toBeInTheDocument()
    })

    it('logo link points to root path', () => {
      render(<Navbar />)
      const logoLink = screen.getByLabelText('DoceOcho Studio - Ir al inicio')
      expect(logoLink).toHaveAttribute('href', '/')
    })
  })

  describe('WhatsApp URL - desktop CTA', () => {
    it('desktop WhatsApp CTA link uses updated phone number 54935153927563', () => {
      render(<Navbar />)
      const whatsappLinks = screen
        .getAllByRole('link')
        .filter(
          (link) =>
            link.getAttribute('href')?.includes('wa.me') &&
            !link.getAttribute('href')?.includes('mobile')
        )
      const hasUpdatedNumber = whatsappLinks.some((link) =>
        link.getAttribute('href')?.includes('54935153927563')
      )
      expect(hasUpdatedNumber).toBe(true)
    })

    it('desktop WhatsApp CTA link does NOT use old phone number 5493512000000', () => {
      render(<Navbar />)
      const whatsappLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.includes('wa.me'))
      const hasOldNumber = whatsappLinks.some((link) =>
        link.getAttribute('href')?.includes('5493512000000')
      )
      expect(hasOldNumber).toBe(false)
    })

    it('desktop WhatsApp link opens in a new tab', () => {
      render(<Navbar />)
      const whatsappLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.includes('wa.me'))
      whatsappLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('desktop WhatsApp CTA link contains pre-filled message text', () => {
      render(<Navbar />)
      const desktopWaLink = screen
        .getAllByRole('link')
        .find(
          (link) =>
            link.getAttribute('href')?.includes('wa.me/54935153927563?text=') &&
            link.getAttribute('href')?.includes('Hola')
        )
      expect(desktopWaLink).toBeDefined()
    })
  })

  describe('WhatsApp URL - mobile menu', () => {
    it('mobile menu WhatsApp link uses updated phone number 54935153927563', () => {
      render(<Navbar />)
      // Open mobile menu
      const burgerButton = screen.getByLabelText('Abrir menú')
      fireEvent.click(burgerButton)

      const mobileWaLink = screen
        .getAllByRole('link')
        .find(
          (link) =>
            link.getAttribute('href') === 'https://wa.me/54935153927563'
        )
      expect(mobileWaLink).toBeDefined()
    })

    it('mobile menu WhatsApp link does NOT use old phone number 5493512000000', () => {
      render(<Navbar />)
      const burgerButton = screen.getByLabelText('Abrir menú')
      fireEvent.click(burgerButton)

      const oldNumberLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.includes('5493512000000'))
      expect(oldNumberLinks).toHaveLength(0)
    })

    it('mobile menu WhatsApp link has correct full URL', () => {
      render(<Navbar />)
      const burgerButton = screen.getByLabelText('Abrir menú')
      fireEvent.click(burgerButton)

      const mobileWaLink = screen
        .getAllByRole('link')
        .find((link) => link.getAttribute('href') === 'https://wa.me/54935153927563')
      expect(mobileWaLink).toBeInTheDocument()
    })
  })

  describe('Mobile burger button', () => {
    it('renders the burger button with aria-label "Abrir menú"', () => {
      render(<Navbar />)
      expect(screen.getByLabelText('Abrir menú')).toBeInTheDocument()
    })

    it('toggles aria-label to "Cerrar menú" when menu is open', () => {
      render(<Navbar />)
      const burger = screen.getByLabelText('Abrir menú')
      fireEvent.click(burger)
      expect(screen.getByLabelText('Cerrar menú')).toBeInTheDocument()
    })
  })

  describe('Navigation links', () => {
    it('renders all 5 nav section labels', () => {
      render(<Navbar />)
      expect(screen.getAllByText('Estudio').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Proceso')).toBeInTheDocument()
      expect(screen.getByText('Proyectos')).toBeInTheDocument()
      expect(screen.getByText('Materiales')).toBeInTheDocument()
      expect(screen.getByText('Contacto')).toBeInTheDocument()
    })
  })
})