const React = require('react')

// Create a forwardRef motion component that strips animation props and renders a plain element
function createMotionComponent(tag) {
  const Component = React.forwardRef(function MotionComponent(
    { children, initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, viewport, ...rest },
    ref
  ) {
    return React.createElement(tag, { ref, ...rest }, children)
  })
  Component.displayName = `motion.${tag}`
  return Component
}

const motion = new Proxy(
  {},
  {
    get(_, tag) {
      return createMotionComponent(tag)
    },
  }
)

function AnimatePresence({ children }) {
  // Return null for falsy children (equivalent to exit animation completing)
  if (!children) return null
  return children
}

function useInView() {
  return true
}

function useAnimation() {
  return {
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }
}

function useMotionValue(initial) {
  return { get: () => initial, set: jest.fn() }
}

function useTransform(value, input, output) {
  return { get: () => output[0], set: jest.fn() }
}

module.exports = {
  motion,
  AnimatePresence,
  useInView,
  useAnimation,
  useMotionValue,
  useTransform,
}