import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { siteStatsResponseSchema } from '@analytics/protocol/site-stats'
import type { WebVitalsSummary } from '@analytics/protocol/web-vitals'

import { aWebVitalsBeacon, createApiHarness } from './api-harness'

const api = createApiHarness()

beforeAll(api.start)
beforeEach(api.resetDatabase)
afterAll(api.stop)

const readWebVitals = async (): Promise<WebVitalsSummary> => {
  const response = await api.request('/api/sites/portfolio/stats')
  expect(response.status, 'stats answer').toBe(200)
  return siteStatsResponseSchema.parse(await response.json()).webVitals
}

describe('collecting Web Vitals', () => {
  it('[vitals] counts each measured metric towards its p75', async () => {
    const response = await api.sendWebVitals(
      aWebVitalsBeacon({ cls: 0.04, inp: null, lcp: 1840 })
    )
    expect(response.status).toBe(202)

    const webVitals = await readWebVitals()
    expect(webVitals.lcp).toEqual({ p75: 1900, samples: 1 })
    expect(webVitals.cls).toEqual({ p75: 0.05, samples: 1 })
    expect(webVitals.inp).toEqual({ p75: null, samples: 0 })
  })

  it('[vitals] adds page loads that land in the same bucket', async () => {
    await api.sendWebVitals(aWebVitalsBeacon({ lcp: 1210 }))
    await api.sendWebVitals(aWebVitalsBeacon({ lcp: 1290 }))

    const webVitals = await readWebVitals()
    expect(webVitals.lcp).toEqual({ p75: 1300, samples: 2 })
  })

  it('[vitals] refuses a report from an origin that is not the site', async () => {
    const response = await api.sendWebVitals(aWebVitalsBeacon(), {
      origin: 'https://evil.example'
    })
    expect(response.status).toBe(403)

    const webVitals = await readWebVitals()
    expect(webVitals.lcp.samples).toBe(0)
  })

  it('[vitals] accepts a crawler without counting it', async () => {
    const response = await api.sendWebVitals(aWebVitalsBeacon(), {
      userAgent: 'Mozilla/5.0 Chrome-Lighthouse'
    })
    expect(response.status).toBe(202)

    const webVitals = await readWebVitals()
    expect(webVitals.lcp.samples).toBe(0)
  })

  it('[vitals] rejects a body that is not a Web Vitals report', async () => {
    const negative = await api.sendWebVitals(aWebVitalsBeacon({ lcp: -1 }))
    expect(negative.status).toBe(400)

    const pageView = await api.sendWebVitals({ path: '/', site: 'portfolio' })
    expect(pageView.status).toBe(400)
  })
})
