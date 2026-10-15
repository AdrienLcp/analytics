import { describe, expect, it } from 'vitest'

import { RETENTION_MONTHS, retentionCutoffAt } from './retention-window'

describe('retentionCutoffAt', () => {
  it('[retention] keeps the last 25 calendar months', () => {
    expect(RETENTION_MONTHS).toBe(25)
    expect(
      retentionCutoffAt(Temporal.Instant.from('2026-10-15T03:17:00.000Z'))
    ).toEqual({
      before: '2024-09-15T03:17:00.000Z',
      beforeDay: '2024-09-15'
    })
  })

  it('[retention] lands on the last day of a shorter month', () => {
    expect(
      retentionCutoffAt(Temporal.Instant.from('2026-03-31T00:00:00.000Z'))
    ).toEqual({
      before: '2024-02-29T00:00:00.000Z',
      beforeDay: '2024-02-29'
    })
  })
})
