import type { WebVitalsBeacon } from '@analytics/protocol/web-vitals'

type Measurements = Pick<WebVitalsBeacon, 'cls' | 'inp' | 'lcp'>

/** Missing from the DOM typings: only Chromium reports layout shifts. */
type LayoutShift = PerformanceEntry & {
  hadRecentInput: boolean
  value: number
}

const isLayoutShift = (entry: PerformanceEntry): entry is LayoutShift =>
  'hadRecentInput' in entry &&
  typeof entry.hadRecentInput === 'boolean' &&
  'value' in entry &&
  typeof entry.value === 'number'

const isEventTiming = (
  entry: PerformanceEntry
): entry is PerformanceEventTiming => entry instanceof PerformanceEventTiming

/** Missing from the DOM typings too: the `event` entry type's reporting floor. */
type ObserverOptions = PerformanceObserverInit & { durationThreshold?: number }

/** The shortest event duration a browser accepts to report. */
const MIN_EVENT_DURATION_MS = 16
/** A layout shift session ends after this long without a shift… */
const SHIFT_SESSION_GAP_MS = 1000
/** …or once it has lasted this long. */
const SHIFT_SESSION_MAX_MS = 5000
/** INP ignores one slow interaction in every fifty, as Chrome's definition does. */
const INTERACTIONS_PER_IGNORED_OUTLIER = 50

const observe = (
  type: string,
  onEntries: (entries: PerformanceEntryList) => void,
  options: ObserverOptions = {}
): boolean => {
  if (!PerformanceObserver.supportedEntryTypes?.includes(type)) return false

  new PerformanceObserver((list) => onEntries(list.getEntries())).observe({
    buffered: true,
    type,
    ...options
  })
  return true
}

const watchLargestContentfulPaint = (): (() => number | null) => {
  let lcp: number | null = null
  const startedHidden = document.visibilityState === 'hidden'

  observe('largest-contentful-paint', (entries) => {
    const latest = entries.at(-1)
    if (latest !== undefined) lcp = latest.startTime
  })

  return () => (startedHidden ? null : lcp)
}

/** The largest burst of shifts, not their sum over the whole life of the page. */
const watchCumulativeLayoutShift = (): (() => number | null) => {
  let cls = 0
  let sessionValue = 0
  let sessionStart = 0
  let sessionEnd = 0

  const isSupported = observe('layout-shift', (entries) => {
    for (const shift of entries.filter(isLayoutShift)) {
      if (shift.hadRecentInput) continue

      const startsSession =
        shift.startTime - sessionEnd > SHIFT_SESSION_GAP_MS ||
        shift.startTime - sessionStart > SHIFT_SESSION_MAX_MS

      if (startsSession) {
        sessionValue = 0
        sessionStart = shift.startTime
      }

      sessionValue += shift.value
      sessionEnd = shift.startTime
      cls = Math.max(cls, sessionValue)
    }
  })

  return () => (isSupported ? cls : null)
}

/** Several events — pointerdown, pointerup, click — make one interaction; the slowest counts. */
const watchInteractionToNextPaint = (): (() => number | null) => {
  const durationByInteraction = new Map<number, number>()

  observe(
    'event',
    (entries) => {
      for (const event of entries.filter(isEventTiming)) {
        if (!event.interactionId) continue

        const slowest = durationByInteraction.get(event.interactionId) ?? 0
        durationByInteraction.set(
          event.interactionId,
          Math.max(slowest, event.duration)
        )
      }
    },
    { durationThreshold: MIN_EVENT_DURATION_MS }
  )

  return () => {
    const slowestFirst = [...durationByInteraction.values()].sort(
      (a, b) => b - a
    )
    const ignoredOutliers = Math.floor(
      slowestFirst.length / INTERACTIONS_PER_IGNORED_OUTLIER
    )

    return slowestFirst[ignoredOutliers] ?? null
  }
}

/**
 * Starts measuring at once and reports the first time the page is hidden —
 * the last moment a browser reliably lets a beacon leave, closing tabs
 * included. A page with nothing measured reports nothing.
 */
export const reportWebVitalsOnHide = (
  report: (measurements: Measurements) => void
): void => {
  const lcp = watchLargestContentfulPaint()
  const cls = watchCumulativeLayoutShift()
  const inp = watchInteractionToNextPaint()

  const onHidden = () => {
    if (document.visibilityState !== 'hidden') return
    removeEventListener('visibilitychange', onHidden, true)

    const measurements = { cls: cls(), inp: inp(), lcp: lcp() }
    if (Object.values(measurements).some((value) => value !== null)) {
      report(measurements)
    }
  }

  addEventListener('visibilitychange', onHidden, true)
}
