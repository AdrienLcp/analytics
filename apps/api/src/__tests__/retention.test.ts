import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import {
  type SiteStatsResponse,
  siteStatsResponseSchema
} from '@analytics/protocol/site-stats'

import { RETENTION_MONTHS } from '@/domain/retention/retention-window'
import { now } from '@/infrastructure/clock'

import { aBeacon, aWebVitalsBeacon, createApiHarness } from './api-harness'

const api = createApiHarness()

beforeAll(api.start)
beforeEach(api.resetDatabase)
afterAll(api.stop)

const readStats = async (): Promise<SiteStatsResponse> => {
  const response = await api.request('/api/sites/portfolio/stats')
  expect(response.status, 'stats answer').toBe(200)
  return siteStatsResponseSchema.parse(await response.json())
}

const monthsFromNow = (months: number): Temporal.Instant =>
  now().toZonedDateTimeISO('UTC').add({ months }).toInstant()

const collectOneVisit = async () => {
  expect((await api.sendBeacon(aBeacon())).status).toBe(202)
  expect((await api.sendWebVitals(aWebVitalsBeacon())).status).toBe(202)
}

describe('the retention purge', () => {
  it('[retention] keeps what is younger than the retention window', async () => {
    await collectOneVisit()

    const outcome = await api.runCron(monthsFromNow(RETENTION_MONTHS - 1))
    expect(outcome).toBe('ok')

    const stats = await readStats()
    expect(stats.totals.pageViews).toBe(1)
    expect(stats.webVitals.lcp.samples).toBe(1)
  })

  it('[retention] deletes page views and Web Vitals past the retention window', async () => {
    await collectOneVisit()

    const outcome = await api.runCron(monthsFromNow(RETENTION_MONTHS + 1))
    expect(outcome).toBe('ok')

    const stats = await readStats()
    expect(stats.totals.pageViews).toBe(0)
    expect(stats.webVitals.lcp.samples).toBe(0)
  })
})
