import type React from 'react'

const MAIN_ID = 'main'

/** The skip link's target. */
export const MAIN_HREF = `#${MAIN_ID}`

const keepBackgroundClicksInert = (
  event: React.MouseEvent<HTMLElement>
): void => {
  if (event.target === event.currentTarget) {
    event.preventDefault()
  }
}

/**
 * Every page renders its content in this one landmark. `tabIndex={-1}` makes it
 * focusable by script and never by Tab; a click on its bare background stays
 * inert, so it takes no focus and Chrome blinks no stray caret.
 */
export const Main: React.FC<
  Omit<React.ComponentProps<'main'>, 'id' | 'onMouseDown' | 'tabIndex'>
> = (props) => (
  <main
    {...props}
    id={MAIN_ID}
    onMouseDown={keepBackgroundClicksInert}
    tabIndex={-1}
  />
)

export const focusMain = (options?: FocusOptions): void => {
  document.getElementById(MAIN_ID)?.focus(options)
}
