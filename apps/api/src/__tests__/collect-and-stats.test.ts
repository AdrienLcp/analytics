import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import {
  type SiteStatsResponse,
  siteStatsResponseSchema
} from '@analytics/protocol/site-stats'

import { aBeacon, createApiHarness } from './api-harness'

const api = createApiHarness()

beforeAll(api.start)
beforeEach(api.resetDatabase)
afterAll(api.stop)

const readStats = async (query = ''): Promise<SiteStatsResponse> => {
  const response = await api.request(`/api/sites/portfolio/stats${query}`)
  expect(response.status, 'stats answer').toBe(200)
  return siteStatsResponseSchema.parse(await response.json())
}

describe('collecting page views', () => {
  it('[collect] counts a direct arrival as a page view and a visit', async () => {
    const response = await api.sendBeacon(aBeacon({ path: '/en/cv' }))
    expect(response.status).toBe(202)

    const stats = await readStats()
    expect(stats.totals).toEqual({ pageViews: 1, visits: 1 })
    expect(stats.breakdowns.pages).toEqual([{ count: 1, key: '/en/cv' }])
    expect(stats.breakdowns.devices).toEqual([{ count: 1, key: 'desktop' }])
    expect(stats.breakdowns.referrers).toEqual([])
  })

  it('[collect] continues the visit on a page reached from the same site', async () => {
    await api.sendBeacon(aBeacon())
    await api.sendBeacon(
      aBeacon({
        path: '/en/projects',
        referrer: 'https://portfolio-9qi.pages.dev/'
      })
    )

    const stats = await readStats()
    expect(stats.totals).toEqual({ pageViews: 2, visits: 1 })
  })

  it('[collect] keeps only the host of an external referrer', async () => {
    await api.sendBeacon(
      aBeacon({ referrer: 'https://www.linkedin.com/in/someone?trk=abc' })
    )

    const stats = await readStats()
    expect(stats.breakdowns.referrers).toEqual([
      { count: 1, key: 'linkedin.com' }
    ])
  })

  it('[collect] refuses a beacon from an origin that is not the site', async () => {
    const response = await api.sendBeacon(aBeacon(), {
      origin: 'https://preview.portfolio-9qi.pages.dev'
    })
    expect(response.status).toBe(403)

    const stats = await readStats()
    expect(stats.totals.pageViews).toBe(0)
  })

  it('[collect] accepts a crawler without counting it', async () => {
    const response = await api.sendBeacon(aBeacon(), {
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1)'
    })
    expect(response.status).toBe(202)

    const stats = await readStats()
    expect(stats.totals.pageViews).toBe(0)
  })

  it('[collect] rejects a body that is not a page view', async () => {
    const malformed = await api.request('/api/collect', {
      body: '{not json',
      headers: { Origin: 'https://portfolio-9qi.pages.dev' },
      method: 'POST'
    })
    expect(malformed.status).toBe(400)

    const withQuery = await api.sendBeacon(aBeacon({ path: 'en/cv' }))
    expect(withQuery.status).toBe(400)
  })
})

describe('reading stats', () => {
  it('[stats] fills every day of the period, today last', async () => {
    await api.sendBeacon(aBeacon())

    const stats = await readStats('?period=7d')
    expect(stats.series).toHaveLength(7)
    expect(stats.series.at(-1)?.pageViews).toBe(1)
    expect(stats.series.slice(0, -1).every((day) => day.pageViews === 0)).toBe(
      true
    )
  })

  it('[stats] refuses an unknown site or period', async () => {
    expect((await api.request('/api/sites/nope/stats')).status).toBe(400)
    expect(
      (await api.request('/api/sites/portfolio/stats?period=1h')).status
    ).toBe(400)
  })
})

describe('the root', () => {
  it('[home] sends a visitor to the source until the dashboard ships', async () => {
    const response = await api.request('/', { redirect: 'manual' })

    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe(
      'https://github.com/AdrienLcp/analytics'
    )
  })
})
