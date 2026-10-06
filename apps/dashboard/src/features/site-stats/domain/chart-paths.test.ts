import { describe, expect, it } from 'vitest'

import {
  areaPath,
  barPath,
  crispLine,
  linePath,
  separatedLabels
} from './chart-paths'

describe('linePath', () => {
  it('[chart] moves to the first point and draws a line to each next one', () => {
    expect(
      linePath([
        [0, 10],
        [5.25, 2],
        [10, 0]
      ])
    ).toBe('M0,10L5.3,2L10,0')
  })

  it('[chart] draws nothing for an empty series', () => {
    expect(linePath([])).toBe('')
  })
})

describe('areaPath', () => {
  it('[chart] closes the ground under a line along the baseline', () => {
    expect(
      areaPath({
        baseline: 20.5,
        points: [
          [0, 10],
          [10, 0]
        ]
      })
    ).toBe('M0,10L10,0L10,20.5L0,20.5Z')
  })

  it('[chart] draws nothing for an empty series', () => {
    expect(areaPath({ baseline: 20, points: [] })).toBe('')
  })
})

describe('barPath', () => {
  it('[chart] rounds the two top corners of a bar standing on the baseline', () => {
    expect(barPath({ baseline: 100, left: 10, top: 40, width: 20 })).toBe(
      'M10,100V44Q10,40 14,40H26Q30,40 30,44V100Z'
    )
  })

  it('[chart] never rounds a corner past half the bar or its height', () => {
    expect(barPath({ baseline: 100, left: 0, top: 98, width: 3 })).toBe(
      'M0,100V99.5Q0,98 1.5,98H1.5Q3,98 3,99.5V100Z'
    )
  })
})

describe('separatedLabels', () => {
  it('[chart] leaves labels that are already far enough apart', () => {
    expect(
      separatedLabels({ minDistance: 42, pageViews: 10, visits: 100 })
    ).toEqual({
      pageViews: 10,
      visits: 100
    })
  })

  it('[chart] pulls overlapping labels apart around their midpoint', () => {
    expect(
      separatedLabels({ minDistance: 42, pageViews: 50, visits: 60 })
    ).toEqual({
      pageViews: 34,
      visits: 76
    })
  })

  it('[chart] stacks the labels of two lines ending on the same value', () => {
    expect(
      separatedLabels({ minDistance: 42, pageViews: 80, visits: 80 })
    ).toEqual({
      pageViews: 59,
      visits: 101
    })
  })
})

describe('crispLine', () => {
  it('[chart] moves a line onto the middle of its pixel', () => {
    expect(crispLine(12.3)).toBe(12.5)
    expect(crispLine(12.7)).toBe(13.5)
  })
})
