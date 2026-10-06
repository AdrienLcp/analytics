import { type Metric, onCLS, onINP, onLCP } from 'web-vitals'

import type {
  WebVitalMetric,
  WebVitalsBeacon
} from '@analytics/protocol/web-vitals'

import { currentPath } from './browser'

type Measurements = Pick<WebVitalsBeacon, 'cls' | 'inp' | 'lcp' | 'path'>

const METRIC_BY_NAME: Partial<Record<Metric['name'], WebVitalMetric>> = {
  CLS: 'cls',
  INP: 'inp',
  LCP: 'lcp'
}

/** Every change, so a value the library settles while the page hides is not lost. */
const REPORT_OPTIONS = { reportAllChanges: true }

/**
 * Measures through Google's `web-vitals` and reports the first time the page
 * is hidden — the last moment a browser reliably lets a beacon leave, closing
 * tabs included. The listener bubbles, so it runs after every capturing
 * listener web-vitals settles its values in. A page restored from the
 * back-forward cache is a new load and reports again. A load with nothing
 * measured reports nothing.
 */
export const reportWebVitalsOnHide = (
  report: (measurements: Measurements) => void
): void => {
  const emptyLoad = (): Measurements => ({
    cls: null,
    inp: null,
    lcp: null,
    path: currentPath()
  })
  let load = emptyLoad()
  let isReported = false

  const record = ({ name, value }: Metric) => {
    const metric = METRIC_BY_NAME[name]
    if (metric !== undefined && !isReported) load = { ...load, [metric]: value }
  }

  onLCP(record, REPORT_OPTIONS)
  onCLS(record, REPORT_OPTIONS)
  onINP(record, REPORT_OPTIONS)

  const onHidden = () => {
    if (document.visibilityState !== 'hidden' || isReported) return

    isReported = true
    if (load.cls !== null || load.inp !== null || load.lcp !== null)
      report(load)
  }

  const onRestored = (event: PageTransitionEvent) => {
    if (!event.persisted) return

    load = emptyLoad()
    isReported = false
  }

  addEventListener('visibilitychange', onHidden)
  addEventListener('pageshow', onRestored)
}
