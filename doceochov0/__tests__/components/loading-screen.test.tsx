import React from 'react'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoadingScreen from '../../components/loading-screen'

jest.mock('framer-motion')
jest.mock('next/image')

describe('LoadingScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the logo image with correct src', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo-doce8.png')
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

  it('renders DoceOcho brand text', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('DoceOcho')).toBeInTheDocument()
  })

  it('renders Estudio label', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('Estudio')).toBeInTheDocument()
  })

  it('renders location text', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('Córdoba, Argentina')).toBeInTheDocument()
  })

  it('logo container has relative positioning class', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    // The image is inside a div.relative
    const container = logo.parentElement
    expect(container).toHaveClass('relative')
  })

  it('logo container has correct size classes', () => {
    render(<LoadingScreen />)
    const logo = screen.getByAltText('DoceOcho Estudio Logo')
    const container = logo.parentElement
    expect(container).toHaveClass('w-48')
    expect(container).toHaveClass('h-48')
  })

  it('loading screen is initially visible', () => {
    render(<LoadingScreen />)
    // The loading screen should be present immediately on render
    expect(screen.getByText('DoceOcho')).toBeInTheDocument()
  })

  it('dismisses loading screen after progress reaches 100', async () => {
    render(<LoadingScreen />)
    // Advance timers enough for progress to reach 100 (max increment is 22 per 120ms, needs at least 500ms)
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    // After additional 600ms delay for the fade-out setTimeout
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    // After the loading completes, the DoceOcho text should no longer be visible
    // (AnimatePresence mock renders children, so we check isLoading state by checking if interval continues)
    // The component removes itself from the DOM after loading
    expect(screen.queryByText('DoceOcho')).not.toBeInTheDocument()
  })
})