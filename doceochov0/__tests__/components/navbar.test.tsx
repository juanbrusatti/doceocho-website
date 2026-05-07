import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Navbar from '../../components/navbar'

jest.mock('framer-motion')
jest.mock('next/image')
jest.mock('next/link')

const NEW_WHATSAPP_NUMBER = '54935153927563'
const OLD_WHATSAPP_NUMBER = '5493512000000'

describe('Navbar', () => {
  beforeEach(() => {
    // Mock scrollY and event listeners
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
    jest.spyOn(window, 'addEventListener').mockImplementation(() => {})
    jest.spyOn(window, 'removeEventListener').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Logo Image', () => {
    it('renders the logo image with correct src', () => {
      render(<Navbar />)
      const logo = screen.getByAltText('DoceOcho Estudio Logo')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', '/logo-doce8.png')
    })

    it('renders the logo image with fill prop', () => {
      render(<Navbar />)
      const logo = screen.getByAltText('DoceOcho Estudio Logo')
      expect(logo).toHaveAttribute('data-fill', 'true')
    })

    it('logo image does NOT have priority prop (not above the fold critical)', () => {
      render(<Navbar />)
      const logo = screen.getByAltText('DoceOcho Estudio Logo')
      expect(logo).not.toHaveAttribute('data-priority', 'true')
    })

    it('renders logo image with object-contain class', () => {
      render(<Navbar />)
      const logo = screen.getByAltText('DoceOcho Estudio Logo')
      expect(logo).toHaveClass('object-contain')
    })

    it('logo container has relative positioning', () => {
      render(<Navbar />)
      const logo = screen.getByAltText('DoceOcho Estudio Logo')
      expect(logo.parentElement).toHaveClass('relative')
    })

    it('logo container has size classes w-10 h-10', () => {
      render(<Navbar />)
      const logo = screen.getByAltText('DoceOcho Estudio Logo')
      const container = logo.parentElement
      expect(container).toHaveClass('w-10')
      expect(container).toHaveClass('h-10')
    })
  })

  describe('Logo link structure', () => {
    it('renders the logo link with correct aria-label', () => {
      render(<Navbar />)
      const logoLink = screen.getByRole('link', { name: /DoceOcho Studio - Ir al inicio/i })
      expect(logoLink).toBeInTheDocument()
    })

    it('logo link points to home page', () => {
      render(<Navbar />)
      const logoLink = screen.getByRole('link', { name: /DoceOcho Studio - Ir al inicio/i })
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('renders DoceOcho text next to logo image', () => {
      render(<Navbar />)
      expect(screen.getByText('DoceOcho')).toBeInTheDocument()
    })

    it('renders Estudio text next to logo image', () => {
      render(<Navbar />)
      // Multiple "Estudio" texts may exist (nav button + brand text), get all
      const estudioElements = screen.getAllByText('Estudio')
      expect(estudioElements.length).toBeGreaterThanOrEqual(1)
    })

    it('logo link has flex items-center layout class', () => {
      render(<Navbar />)
      const logoLink = screen.getByRole('link', { name: /DoceOcho Studio - Ir al inicio/i })
      expect(logoLink).toHaveClass('flex')
      expect(logoLink).toHaveClass('items-center')
    })
  })

  describe('WhatsApp links - updated phone number', () => {
    it('desktop WhatsApp CTA contains updated phone number', () => {
      render(<Navbar />)
      const whatsappLinks = screen.getAllByRole('link', { name: /WhatsApp/i })
      const desktopCTA = whatsappLinks.find((link) =>
        link.getAttribute('href')?.includes(NEW_WHATSAPP_NUMBER)
      )
      expect(desktopCTA).toBeDefined()
    })

    it('desktop WhatsApp CTA href does NOT contain old phone number', () => {
      render(<Navbar />)
      const whatsappLinks = screen.getAllByRole('link', { name: /WhatsApp/i })
      whatsappLinks.forEach((link) => {
        expect(link.getAttribute('href')).not.toContain(OLD_WHATSAPP_NUMBER)
      })
    })

    it('desktop WhatsApp CTA has correct full href', () => {
      render(<Navbar />)
      const whatsappLinks = screen.getAllByRole('link', { name: /WhatsApp/i })
      const desktopCTA = whatsappLinks.find((link) =>
        link.classList.contains('hidden') || link.getAttribute('href')?.includes('text=')
      )
      expect(desktopCTA?.getAttribute('href')).toContain(
        `https://wa.me/${NEW_WHATSAPP_NUMBER}`
      )
    })

    it('desktop WhatsApp CTA opens in new tab', () => {
      render(<Navbar />)
      const whatsappLinks = screen.getAllByRole('link', { name: /WhatsApp/i })
      whatsappLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('mobile menu WhatsApp link contains updated phone number', () => {
      render(<Navbar />)
      // Open mobile menu
      const burgerButton = screen.getByRole('button', { name: /Abrir menú/i })
      fireEvent.click(burgerButton)

      const whatsappLinks = screen.getAllByRole('link', { name: /WhatsApp/i })
      const mobileLink = whatsappLinks.find((link) =>
        link.getAttribute('href') === `https://wa.me/${NEW_WHATSAPP_NUMBER}`
      )
      expect(mobileLink).toBeDefined()
    })

    it('mobile menu WhatsApp link does NOT contain old phone number', () => {
      render(<Navbar />)
      const burgerButton = screen.getByRole('button', { name: /Abrir menú/i })
      fireEvent.click(burgerButton)

      const whatsappLinks = screen.getAllByRole('link', { name: /WhatsApp/i })
      whatsappLinks.forEach((link) => {
        expect(link.getAttribute('href')).not.toContain(OLD_WHATSAPP_NUMBER)
      })
    })

    it('mobile menu WhatsApp link has exact href with updated number', () => {
      render(<Navbar />)
      const burgerButton = screen.getByRole('button', { name: /Abrir menú/i })
      fireEvent.click(burgerButton)

      // Multiple WhatsApp links in DOM (desktop CTA + mobile menu link)
      const allLinks = screen.getAllByRole('link', { name: /WhatsApp/i })
      const mobileMenuLink = allLinks.find(
        (link) => link.getAttribute('href') === `https://wa.me/${NEW_WHATSAPP_NUMBER}`
      )
      expect(mobileMenuLink).toBeDefined()
    })
  })

  describe('Mobile menu toggle', () => {
    it('mobile burger button has correct initial aria-label', () => {
      render(<Navbar />)
      expect(screen.getByRole('button', { name: 'Abrir menú' })).toBeInTheDocument()
    })

    it('mobile burger button aria-label changes after click', () => {
      render(<Navbar />)
      const burgerButton = screen.getByRole('button', { name: 'Abrir menú' })
      fireEvent.click(burgerButton)
      expect(screen.getByRole('button', { name: 'Cerrar menú' })).toBeInTheDocument()
    })
  })

  describe('Navigation links', () => {
    it('renders all 5 navigation links', () => {
      render(<Navbar />)
      expect(screen.getAllByText('Estudio').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Proceso').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Proyectos').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Materiales').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Contacto').length).toBeGreaterThanOrEqual(1)
    })
  })
})