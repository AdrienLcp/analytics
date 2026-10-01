import { describe, expect, it } from 'vitest'

import { bucketStart } from './bucket'
import { dayTickIndexes, monthTickIndexes, niceMaximum } from './chart-layout'

describe('niceMaximum', () => {
  it('[chart] rounds the top of the axis up to a readable step', () => {
    expect(niceMaximum(253)).toBe(320)
    expect(niceMaximum(7)).toBe(8)
    expect(niceMaximum(1)).toBe(4)
  })

  it('[chart] keeps every grid step a whole number of page views', () => {
    expect(niceMaximum(5)).toBe(8)
    expect(niceMaximum(13)).toBe(16)
  })

  it('[chart] still draws a scale for an empty series', () => {
    expect(niceMaximum(0)).toBe(4)
  })
})

describe('tick indexes', () => {
  it('[chart] labels a week day by day, and every other day when tight', () => {
    expect(dayTickIndexes({ count: 7, labelWidth: 44, pitch: 150 })).toEqual([
      0, 1, 2, 3, 4, 5, 6
    ])
    expect(dayTickIndexes({ count: 7, labelWidth: 44, pitch: 48 })).toEqual([
      0, 2, 4, 6
    ])
  })

  it('[chart] labels thirty days once a week, leaving out a crowded last day', () => {
    expect(dayTickIndexes({ count: 30, labelWidth: 58, pitch: 31 })).toEqual([
      0, 7, 14, 21, 28
    ])
  })

  it('[chart] thins day labels on a phone so the first two never touch', () => {
    expect(dayTickIndexes({ count: 30, labelWidth: 58, pitch: 9.8 })).toEqual([
      0, 14, 28
    ])
  })

  it('[chart] keeps a last day that stands far enough from the label before it', () => {
    expect(dayTickIndexes({ count: 26, labelWidth: 58, pitch: 31 })).toEqual([
      0, 7, 14, 21, 25
    ])
  })

  it('[chart] labels every month when they fit, and thins them when they do not', () => {
    expect(
      monthTickIndexes({ count: 12, labelWidth: 36, pitch: 85 })
    ).toHaveLength(12)
    expect(monthTickIndexes({ count: 12, labelWidth: 36, pitch: 20 })).toEqual([
      0, 3, 6, 9
    ])
  })

  it('[chart] falls back to the widest step before the width is measured', () => {
    expect(dayTickIndexes({ count: 30, labelWidth: 58, pitch: 0 })).toEqual([
      0, 21
    ])
  })
})

describe('bucketStart', () => {
  it('[chart] reads a day and a month bucket as midnight UTC', () => {
    expect(
      bucketStart({ bucket: '2026-09-30', unit: 'day' }).toISOString()
    ).toBe('2026-09-30T00:00:00.000Z')
    expect(
      bucketStart({ bucket: '2025-10', unit: 'month' }).toISOString()
    ).toBe('2025-10-01T00:00:00.000Z')
  })
})
