import type React from 'react'

type RegistrationMarkProps = {
  className?: string
}

/** The printer's crosshair that pins a plate to its sheet. Decorative. */
export const RegistrationMark: React.FC<RegistrationMarkProps> = ({
  className
}) => (
  <svg
    aria-hidden='true'
    className={className}
    focusable='false'
    viewBox='0 0 26 26'
  >
    <circle cx='13' cy='13' fill='none' r='6' stroke='currentColor' />
    <path d='M13 0v26M0 13h26' stroke='currentColor' />
  </svg>
)
