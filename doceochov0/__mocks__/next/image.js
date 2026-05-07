const React = require('react')

function MockImage({ src, alt, fill, priority, className, ...rest }) {
  return React.createElement('img', {
    src,
    alt,
    'data-fill': fill ? 'true' : undefined,
    'data-priority': priority ? 'true' : undefined,
    className,
    ...rest,
  })
}

module.exports = MockImage
module.exports.default = MockImage