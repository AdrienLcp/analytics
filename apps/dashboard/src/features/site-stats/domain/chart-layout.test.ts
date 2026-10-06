import { describe, expect, it } from 'vitest'

import { bucketStart } from './bucket'
import { chartLayout, dayTickIndexes, monthTickIndexes } from './chart-layout'

const gridValuesFor = (maximum: number): number[] =>
  chartLayout({ count: 30, maximum, unit: 'day', width: 800 }).gridValues

describe('value axis', () => {
  it('[chart] rounds the top of the axis up to a readable step', () => {
    expect(gridValuesFor(253)).toEqual([0, 100, 200, 300])
    expect(gridValuesFor(7)).toEqual([0, 2, 4, 6, 8])
    expect(gridValuesFor(1)).toEqual([0, 1, 2, 3, 4])
  })

  it('[chart] keeps every grid step a whole number of page views', () => {
    expect(gridValuesFor(5)).toEqual([0, 1, 2, 3, 4, 5])
    expect(gridValuesFor(13)).toEqual([0, 5, 10, 15])
  })

  it('[chart] still draws a scale for an empty series', () => {
    expect(gridValuesFor(0)).toEqual([0, 1, 2, 3, 4])
  })

  it('[chart] puts zero on the baseline and the top value on the top line', () => {
    const layout = chartLayout({
      count: 30,
      maximum: 7,
      unit: 'day',
      width: 800
    })

    expect(layout.yAt(0)).toBe(layout.bottom)
    expect(layout.yAt(8)).toBe(layout.top)
  })
})

describe('bucket positions', () => {
  it('[chart] spreads days from edge to edge and reads the nearest one back', () => {
    const layout = chartLayout({
      count: 5,
      maximum: 4,
      unit: 'day',
      width: 800
    })

    expect(layout.xAt(0)).toBe(layout.left)
    expect(layout.xAt(4)).toBe(layout.right)
    expect(layout.indexAtX(layout.xAt(2) + layout.pitch * 0.4)).toBe(2)
    expect(layout.indexAtX(-100)).toBe(0)
    expect(layout.indexAtX(10_000)).toBe(4)
  })

  it('[chart] centres a lone day', () => {
    const layout = chartLayout({
      count: 1,
      maximum: 4,
      unit: 'day',
      width: 800
    })

    expect(layout.xAt(0)).toBe((layout.left + layout.right) / 2)
  })

  it('[chart] centres each month in its band and reads the band back', () => {
    const layout = chartLayout({
      count: 4,
      maximum: 4,
      unit: 'month',
      width: 400
    })

    expect(layout.band).toBe((layout.right - layout.left) / 4)
    expect(layout.xAt(1)).toBe(layout.left + layout.band * 1.5)
    expect(layout.indexAtX(layout.left + layout.band * 1.99)).toBe(1)
    expect(layout.indexAtX(layout.right + 50)).toBe(3)
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
