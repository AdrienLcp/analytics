import { describe, expect, it } from 'vitest'

import { busiestBucket, pagesPerVisit } from './traffic-summary'

describe('pagesPerVisit', () => {
  it('[summary] divides page views by visits', () => {
    expect(pagesPerVisit({ pageViews: 9, visits: 4 })).toBe(2.25)
  })

  it('[summary] has no ratio before the first visit', () => {
    expect(pagesPerVisit({ pageViews: 0, visits: 0 })).toBeNull()
    expect(pagesPerVisit({ pageViews: 3, visits: 0 })).toBeNull()
  })
})

describe('busiestBucket', () => {
  it('[summary] picks the bucket with the most page views, the earliest on a tie', () => {
    expect(
      busiestBucket([
        { bucket: '2026-09-01', pageViews: 2, visits: 1 },
        { bucket: '2026-09-02', pageViews: 5, visits: 2 },
        { bucket: '2026-09-03', pageViews: 5, visits: 4 }
      ])?.bucket
    ).toBe('2026-09-02')
  })

  it('[summary] has no busiest bucket in an empty period', () => {
    expect(
      busiestBucket([
        { bucket: '2026-08', pageViews: 0, visits: 0 },
        { bucket: '2026-09', pageViews: 0, visits: 0 }
      ])
    ).toBeNull()
  })
})
