const React = require('react')

function MockLink({ href, children, className, 'aria-label': ariaLabel, ...rest }) {
  return React.createElement('a', { href, className, 'aria-label': ariaLabel, ...rest }, children)
}

module.exports = MockLink
module.exports.default = MockLink