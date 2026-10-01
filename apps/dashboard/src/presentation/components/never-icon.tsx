import type React from 'react'

/** Something that is never recorded. Decorative: the text beside it says so. */
export const NeverIcon: React.FC = () => (
  <svg aria-hidden='true' focusable='false' viewBox='0 0 14 14'>
    <circle
      cx='7'
      cy='7'
      fill='none'
      r='5.6'
      stroke='currentColor'
      strokeWidth='1.3'
    />
    <path d='M3 11L11 3' stroke='currentColor' strokeWidth='1.3' />
  </svg>
)
