import { resolve } from 'node:path'

import { createTestHarness } from 'wrangler'

import type { PageViewBeacon } from '@analytics/protocol/page-view'

export const PORTFOLIO_ORIGIN = 'https://portfolio-9qi.pages.dev'
export const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'

export const aBeacon = (
  overrides: Partial<PageViewBeacon> = {}
): PageViewBeacon => ({
  locale: 'fr-FR',
  path: '/',
  referrer: null,
  site: 'portfolio',
  theme: 'dark',
  viewportWidth: 1440,
  ...overrides
})

type ApiRequestInit = {
  body?: string
  headers?: Record<string, string>
  method?: 'GET' | 'POST'
}

/**
 * The Worker as `wrangler.jsonc` builds it, over a local D1 that `reset()`
 * recreates empty: the SQL runs exactly as Cloudflare runs it, and no test
 * sees another's page views.
 */
export const createApiHarness = () => {
  const server = createTestHarness({
    workers: [
      { configPath: resolve(import.meta.dirname, '../../wrangler.jsonc') }
    ]
  })

  const start = async () => {
    await server.listen()
  }

  const resetDatabase = async () => {
    await server.reset()
    await server.getWorker<Env>().applyD1Migrations('DB')
  }

  const request = (path: string, init?: ApiRequestInit) =>
    server.fetch(path, init)

  const sendBeacon = (
    beacon: unknown,
    {
      origin = PORTFOLIO_ORIGIN,
      userAgent = BROWSER_USER_AGENT
    }: { origin?: string; userAgent?: string } = {}
  ) =>
    request('/api/collect', {
      body: JSON.stringify(beacon),
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        Origin: origin,
        'User-Agent': userAgent
      },
      method: 'POST'
    })

  return {
    request,
    resetDatabase,
    sendBeacon,
    start,
    stop: () => server.close()
  }
}
