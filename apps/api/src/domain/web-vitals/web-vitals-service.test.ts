import { Result } from '@adrienlcp/result'
import { describe, expect, it } from 'vitest'

import { recordWebVitals } from './web-vitals-service'
import type { WebVitalsStore } from './web-vitals-store'

const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'

const storeRecordingPaths = () => {
  const paths: string[] = []
  const webVitals: WebVitalsStore = {
    increment: async ({ path }) => {
      paths.push(path)
      return Result.success()
    },
    read: async () => Result.success([])
  }

  return { paths, webVitals }
}

describe('recordWebVitals', () => {
  it('[vitals] counts a page load under its route, never its path', async () => {
    const { paths, webVitals } = storeRecordingPaths()

    await recordWebVitals({
      beacon: {
        cls: 0.02,
        inp: 120,
        lcp: 1800,
        path: '/e/3f9a1c/umpire/481516',
        site: 'scoreboard',
        viewportWidth: 390
      },
      origin: 'https://scoreboard.adrienlcp.com',
      receivedAt: Temporal.Instant.from('2026-10-14T09:00:00Z'),
      userAgent: BROWSER_USER_AGENT,
      webVitals
    })

    expect(paths).toEqual(['/e/:eventId/umpire/:umpireCode'])
  })
})
