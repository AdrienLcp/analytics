import type React from 'react'

/** Points at what a disclosure opens; turned by its stylesheet when open. */
export const ChevronIcon: React.FC = () => (
  <svg aria-hidden='true' focusable='false' viewBox='0 0 10 10'>
    <path
      d='M3 1.5L6.5 5 3 8.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.3'
    />
  </svg>
)
