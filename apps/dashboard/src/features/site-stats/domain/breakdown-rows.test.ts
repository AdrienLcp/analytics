import { describe, expect, it } from 'vitest'

import { toBreakdownRows } from './breakdown-rows'

describe('toBreakdownRows', () => {
  it('[breakdown] groups what the listed rows leave out into one other row', () => {
    const rows = toBreakdownRows({
      tallies: [
        { count: 6, key: 'linkedin.com' },
        { count: 2, key: 'github.com' }
      ],
      total: 10
    })

    expect(rows).toEqual([
      { count: 6, isOther: false, key: 'linkedin.com', share: 0.6 },
      { count: 2, isOther: false, key: 'github.com', share: 0.2 },
      { count: 2, isOther: true, share: 0.2 }
    ])
  })

  it('[breakdown] adds no other row when the listed rows make the whole total', () => {
    const rows = toBreakdownRows({
      tallies: [
        { count: 3, key: 'dark' },
        { count: 1, key: 'light' }
      ],
      total: 4
    })

    expect(rows.map((row) => row.isOther)).toEqual([false, false])
    expect(rows.map((row) => row.share)).toEqual([0.75, 0.25])
  })

  it('[breakdown] gives every visit to the other row when no referrer was kept', () => {
    expect(toBreakdownRows({ tallies: [], total: 5 })).toEqual([
      { count: 5, isOther: true, share: 1 }
    ])
  })

  it('[breakdown] reads a zero total as zero shares, never as a division by zero', () => {
    expect(toBreakdownRows({ tallies: [], total: 0 })).toEqual([])
    expect(
      toBreakdownRows({ tallies: [{ count: 0, key: '/' }], total: 0 })
    ).toEqual([{ count: 0, isOther: false, key: '/', share: 0 }])
  })
})
