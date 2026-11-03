const GESTURES = ['keydown', 'pointerdown', 'wheel'] as const

/** Captured, so a gesture on any element counts; passive, so none waits on it. */
const LISTENER_OPTIONS = { capture: true, passive: true } as const

/**
 * A gesture this soon after the page view is not counted: its engagement could
 * reach the API before the page view is stored, and confirm nothing. The next
 * gesture, or leaving the page, does.
 */
const MIN_ENGAGEMENT_DELAY_MS = 1000

/**
 * Calls `engage` once: at the first gesture a person makes on the page —
 * pressing a key, touching or clicking it, turning a wheel — or when the page
 * is hidden, closing it included. A headless browser that loads the page and
 * is killed does neither. A page view left without a gesture through the back
 * button keeps listening, so the next gesture or hide still engages it.
 */
export const onFirstEngagement = (engage: () => void): void => {
  const viewedAt = performance.now()

  const settle = () => {
    for (const gesture of GESTURES) {
      removeEventListener(gesture, onGesture, LISTENER_OPTIONS)
    }
    removeEventListener('visibilitychange', onVisibilityChange)
    engage()
  }

  const onGesture = () => {
    if (performance.now() - viewedAt >= MIN_ENGAGEMENT_DELAY_MS) settle()
  }

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') settle()
  }

  for (const gesture of GESTURES) {
    addEventListener(gesture, onGesture, LISTENER_OPTIONS)
  }
  addEventListener('visibilitychange', onVisibilityChange)
}
