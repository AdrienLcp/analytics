import type React from 'react'

const MAIN_ID = 'main'

/** The skip link's target. */
export const MAIN_HREF = `#${MAIN_ID}`

/**
 * Every page renders its content in this one landmark. `tabIndex={-1}` makes it
 * focusable by script and never by Tab.
 */
export const Main: React.FC<
  Omit<React.ComponentProps<'main'>, 'id' | 'tabIndex'>
> = (props) => <main {...props} id={MAIN_ID} tabIndex={-1} />

export const focusMain = (options?: FocusOptions): void => {
  document.getElementById(MAIN_ID)?.focus(options)
}
