import { describe, expect, it } from 'vitest'

import { bucketOfMeasurement, summarizeWebVitals } from './web-vital-buckets'

describe('web vital buckets', () => {
  it('[buckets] puts a value on a threshold in the bucket it opens', () => {
    expect(bucketOfMeasurement({ metric: 'lcp', value: 2500 })).toBe(25)
    expect(bucketOfMeasurement({ metric: 'inp', value: 199.9 })).toBe(19)
    expect(bucketOfMeasurement({ metric: 'cls', value: 0.29 })).toBe(29)
  })

  it('[buckets] gathers every value past the range in the last bucket', () => {
    expect(bucketOfMeasurement({ metric: 'lcp', value: 60_000 })).toBe(100)
  })

  it('[p75] reads the bucket three samples in four stay under, at its upper edge', () => {
    const summary = summarizeWebVitals([
      { bucket: 12, count: 2, metric: 'lcp' },
      { bucket: 30, count: 1, metric: 'lcp' },
      { bucket: 5, count: 1, metric: 'lcp' }
    ])

    expect(summary.lcp).toEqual({ p75: 1300, samples: 4 })
  })

  it('[p75] reads the last bucket at its lower edge', () => {
    const summary = summarizeWebVitals([
      { bucket: 100, count: 1, metric: 'cls' }
    ])

    expect(summary.cls).toEqual({ p75: 1, samples: 1 })
  })

  it('[p75] is null for a metric nobody measured', () => {
    expect(summarizeWebVitals([]).inp).toEqual({ p75: null, samples: 0 })
  })
})
