import { describe, expect, it } from 'vitest'

import {
  hasWebVitalSamples,
  rateWebVital,
  scaleShare
} from './web-vital-rating'

describe('rateWebVital', () => {
  it('[web-vitals] rates each metric against its own thresholds', () => {
    expect(rateWebVital({ metric: 'lcp', value: 1900 })).toBe('good')
    expect(rateWebVital({ metric: 'lcp', value: 3200 })).toBe(
      'needs-improvement'
    )
    expect(rateWebVital({ metric: 'lcp', value: 4100 })).toBe('poor')
    expect(rateWebVital({ metric: 'inp', value: 40 })).toBe('good')
    expect(rateWebVital({ metric: 'inp', value: 501 })).toBe('poor')
    expect(rateWebVital({ metric: 'cls', value: 0.19 })).toBe(
      'needs-improvement'
    )
  })

  it('[web-vitals] puts a value equal to a threshold on its better side', () => {
    expect(rateWebVital({ metric: 'lcp', value: 2500 })).toBe('good')
    expect(rateWebVital({ metric: 'lcp', value: 4000 })).toBe(
      'needs-improvement'
    )
    expect(rateWebVital({ metric: 'inp', value: 200 })).toBe('good')
    expect(rateWebVital({ metric: 'inp', value: 500 })).toBe(
      'needs-improvement'
    )
    expect(rateWebVital({ metric: 'cls', value: 0.1 })).toBe('good')
    expect(rateWebVital({ metric: 'cls', value: 0.25 })).toBe(
      'needs-improvement'
    )
  })
})

describe('scaleShare', () => {
  it('[web-vitals] places a value along the scale', () => {
    expect(scaleShare({ metric: 'lcp', value: 3000 })).toBe(0.5)
    expect(scaleShare({ metric: 'inp', value: 0 })).toBe(0)
    expect(scaleShare({ metric: 'cls', value: 0.1 })).toBe(0.25)
  })

  it('[web-vitals] pins a value past the end of the scale to the end', () => {
    expect(scaleShare({ metric: 'lcp', value: 12_000 })).toBe(1)
    expect(scaleShare({ metric: 'cls', value: 3 })).toBe(1)
  })
})

describe('hasWebVitalSamples', () => {
  const unmeasured = { p75: null, samples: 0 }

  it('[web-vitals] has samples once any metric was reported', () => {
    expect(
      hasWebVitalSamples({
        cls: unmeasured,
        inp: { p75: 40, samples: 1 },
        lcp: unmeasured
      })
    ).toBe(true)
  })

  it('[web-vitals] has none before any browser reported', () => {
    expect(
      hasWebVitalSamples({ cls: unmeasured, inp: unmeasured, lcp: unmeasured })
    ).toBe(false)
  })
})
