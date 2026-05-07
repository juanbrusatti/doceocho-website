/**
 * Tests for loading-screen.tsx
 *
 * Scope: PR change added an Image component displaying logo-doce8.png
 * with alt="DoceOcho Estudio Logo", fill, priority, className="object-contain".
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import LoadingScreen from '../components/loading-screen'

// Mock next/image
vi.mock('next/image', () => ({
  default: vi.fn(({ src, alt, fill, priority, className, ...rest }: {
    src: string
    alt: string
    fill?: boolean
    priority?: boolean
    className?: string
    [key: string]: unknown
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      data-fill={fill ? 'true' : undefined}
      data-priority={priority ? 'true' : undefined}
      className={className}
      {...rest}
    />
  )),
}))

// Mock framer-motion so animations don't interfere with rendering
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...rest}>{children}</div>
    ),
    span: ({ children, className, ...rest }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className} {...rest}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('LoadingScreen – logo Image (PR change)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the logo image with the correct src', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo-doce8.png')
  })

  it('renders the logo image with the correct alt text', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders the logo image with fill prop', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toHaveAttribute('data-fill', 'true')
  })

  it('renders the logo image with priority prop', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toHaveAttribute('data-priority', 'true')
  })

  it('renders the logo image with object-contain class', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toHaveClass('object-contain')
  })

  it('still shows the DoceOcho text brand alongside the logo', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('DoceOcho')).toBeInTheDocument()
    expect(screen.getByText('Estudio')).toBeInTheDocument()
  })

  it('loading screen is visible initially (isLoading starts true)', () => {
    render(<LoadingScreen />)
    // The logo should be visible before loading completes
    expect(screen.getByAltText('DoceOcho Estudio Logo')).toBeInTheDocument()
  })

  it('progress interval is started on mount and can be cleared on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    const { unmount } = render(<LoadingScreen />)
    unmount()
    // clearInterval should be called (cleanup from useEffect return)
    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })

  it('shows the "Córdoba, Argentina" location text', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('Córdoba, Argentina')).toBeInTheDocument()
  })
})