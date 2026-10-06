import { area, line } from 'd3-shape'

export type ChartPoint = readonly [x: number, y: number]

const MONTH_BAR_RADIUS = 4

/**
 * A one-pixel line drawn on a whole pixel straddles two and blurs: moved onto
 * the pixel's middle, it stays sharp.
 */
export const crispLine = (position: number): number =>
  Math.round(position) + 0.5

/** Tenths of a pixel are as fine as a screen draws. */
const PATH_DIGITS = 1

/** An SVG path through every point, in order; nothing for an empty series. */
export const linePath = (points: readonly ChartPoint[]): string =>
  line<ChartPoint>()
    .x(([x]) => x)
    .y(([, y]) => y)
    .digits(PATH_DIGITS)(points) ?? ''

/** The ground under a line, closed along `baseline`; nothing for an empty series. */
export const areaPath = ({
  baseline,
  points
}: {
  baseline: number
  points: readonly ChartPoint[]
}): string =>
  area<ChartPoint>()
    .x(([x]) => x)
    .y0(baseline)
    .y1(([, y]) => y)
    .digits(PATH_DIGITS)(points) ?? ''

/** A bar with its two top corners rounded, standing on the zero line. */
export const barPath = ({
  baseline,
  left,
  top,
  width
}: {
  baseline: number
  left: number
  top: number
  width: number
}): string => {
  const radius = Math.min(MONTH_BAR_RADIUS, width / 2, baseline - top)

  return `M${left},${baseline}V${top + radius}Q${left},${top} ${left + radius},${top}H${left + width - radius}Q${left + width},${top} ${left + width},${top + radius}V${baseline}Z`
}

/**
 * Pulls two labels apart around their midpoint when they sit closer than
 * `minDistance`. The visits label sits below the page views one, since a visit
 * is never counted without a page view.
 */
export const separatedLabels = ({
  minDistance,
  pageViews,
  visits
}: {
  minDistance: number
  pageViews: number
  visits: number
}): { pageViews: number; visits: number } => {
  if (visits - pageViews >= minDistance) return { pageViews, visits }

  const middle = (pageViews + visits) / 2

  return {
    pageViews: middle - minDistance / 2,
    visits: middle + minDistance / 2
  }
}
