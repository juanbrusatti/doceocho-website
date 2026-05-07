/**
 * Tests for loading-screen.tsx
 *
 * PR changes: Added next/image <Image> component displaying /logo-doce8.png
 * with alt="DoceOcho Estudio Logo", fill, priority, and object-contain class.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock framer-motion to render children without animations
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
      <div className={className} {...rest}>{children}</div>
    ),
    span: ({ children, className, ...rest }: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) => (
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
    priority,
    className,
  }: {
    src: string
    alt: string
    fill?: boolean
    priority?: boolean
    className?: string
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      data-fill={fill ? 'true' : undefined}
      data-priority={priority ? 'true' : undefined}
      className={className}
    />
  ),
}))

// Mock useState to keep isLoading = true so the loading screen is visible
jest.mock('react', () => {
  const actual = jest.requireActual<typeof React>('react')
  return {
    ...actual,
    useState: (initial: unknown) => {
      // Keep isLoading = true, progress = 0
      return [initial, jest.fn()]
    },
  }
})

import LoadingScreen from '../../components/loading-screen'

describe('LoadingScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('renders the logo image with correct src', () => {
    render(<LoadingScreen />)
    const logo = screen.getByRole('img', { name: /doceOcho estudio logo/i })
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo-doce8.png')
  })

  it('renders the logo image with correct alt text', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders the logo image with priority attribute', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toHaveAttribute('data-priority', 'true')
  })

  it('renders the logo image with fill attribute', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toHaveAttribute('data-fill', 'true')
  })

  it('renders the logo image with object-contain class', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toHaveClass('object-contain')
  })

  it('renders the logo inside a container with correct responsive size classes', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    // The parent wrapper should have the responsive classes for size
    const container = logo.parentElement
    expect(container).toHaveClass('relative')
    expect(container).toHaveClass('w-48')
    expect(container).toHaveClass('h-48')
    expect(container).toHaveClass('md:w-56')
    expect(container).toHaveClass('md:h-56')
  })

  it('renders the DoceOcho brand text', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('DoceOcho')).toBeInTheDocument()
    expect(screen.getByText('Estudio')).toBeInTheDocument()
  })

  it('renders the location text', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('Córdoba, Argentina')).toBeInTheDocument()
  })

  it('logo image appears before the text content', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    const brandText = screen.getByText('DoceOcho')
    // Both should be in the document simultaneously
    expect(logo).toBeInTheDocument()
    expect(brandText).toBeInTheDocument()
    // The logo container comes before the text wrapper in the DOM
    const logoContainer = logo.parentElement!
    const textWrapper = brandText.closest('.flex.flex-col.items-center.gap-1')
    expect(logoContainer.compareDocumentPosition(textWrapper!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    )
  })

  it('renders exactly one logo image', () => {
    render(<LoadingScreen />)
    const logos = screen.getAllByAltText('DoceOcho Estudio Logo')
    expect(logos).toHaveLength(1)
  })
})