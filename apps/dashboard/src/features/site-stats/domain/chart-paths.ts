export type ChartPoint = readonly [x: number, y: number]

const MONTH_BAR_RADIUS = 4

/**
 * A one-pixel line drawn on a whole pixel straddles two and blurs: moved onto
 * the pixel's middle, it stays sharp.
 */
export const crispLine = (position: number): number =>
  Math.round(position) + 0.5

/** An SVG path through every point, in order. */
export const linePath = (points: readonly ChartPoint[]): string =>
  points
    .map(
      ([x, y], index) =>
        `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    )
    .join('')

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
