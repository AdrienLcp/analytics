import { describe, expect, it } from 'vitest'

import { statsWindowFor } from './stats-window'

const now = Temporal.Instant.from('2026-09-30T15:42:00.000Z')

describe('statsWindowFor', () => {
  it('[stats-window] covers the last seven days, today included', () => {
    expect(statsWindowFor({ now, period: '7d' })).toEqual({
      buckets: [
        '2026-09-24',
        '2026-09-25',
        '2026-09-26',
        '2026-09-27',
        '2026-09-28',
        '2026-09-29',
        '2026-09-30'
      ],
      since: '2026-09-24T00:00:00.000Z',
      unit: 'day'
    })
  })

  it('[stats-window] crosses a month boundary over thirty days', () => {
    const window = statsWindowFor({ now, period: '30d' })

    expect(window.buckets).toHaveLength(30)
    expect(window.buckets[0]).toBe('2026-09-01')
    expect(
      statsWindowFor({
        now: Temporal.Instant.from('2026-03-02T00:00:00Z'),
        period: '7d'
      }).buckets[0]
    ).toBe('2026-02-24')
  })

  it('[stats-window] covers twelve months back into the previous year', () => {
    const window = statsWindowFor({ now, period: '12m' })

    expect(window.unit).toBe('month')
    expect(window.buckets[0]).toBe('2025-10')
    expect(window.buckets.at(-1)).toBe('2026-09')
    expect(window.since).toBe('2025-10-01T00:00:00.000Z')
  })
})
