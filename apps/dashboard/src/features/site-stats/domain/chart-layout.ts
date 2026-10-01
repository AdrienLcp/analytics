import type { BucketUnit } from './bucket'

/** Below this width the chart drops its end labels and shortens. */
export const NARROW_CHART_WIDTH = 560

const WIDE_HEIGHT = 330
const NARROW_HEIGHT = 230
const GRID_LINES = 4
/** Room on the right for "1,234 page views" beside the last day. */
const END_LABEL_ROOM = 104
/** Room on the left for the value axis' figures. */
const VALUE_AXIS_ROOM = 40
/** Room below the zero line for the date axis' labels. */
const DATE_AXIS_ROOM = 30
/** Keeps the top grid line's figure inside the drawing. */
const PLOT_TOP = 12
/** Keeps the last point or bar off the right edge when no end label sits there. */
const PLOT_RIGHT_MARGIN = 8
const LONGEST_WEEK = 7
const MONTH_BAR_MIN_WIDTH = 3
const MONTH_BAR_MAX_WIDTH = 22
/** Kept free inside a month's band, around its two bars. */
const MONTH_BAND_PADDING = 12
const NICE_STEPS = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]

/**
 * The top of the value axis: the smallest round number whose quarter is a
 * readable whole step — nobody opens half a page — and which holds `maximum`.
 * An empty series still gets a scale, so its zero line sits where a real one
 * would.
 */
export const niceMaximum = (maximum: number): number => {
  if (maximum <= 0) return GRID_LINES

  const rawStep = maximum / GRID_LINES
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const step =
    NICE_STEPS.map((factor) => factor * magnitude).find(
      (candidate) =>
        candidate >= rawStep && candidate >= 1 && Number.isInteger(candidate)
    ) ?? Math.ceil(rawStep)

  return step * GRID_LINES
}

/** The values the dotted grid lines mark, zero first. */
export const gridValues = (top: number): number[] =>
  Array.from(
    { length: GRID_LINES + 1 },
    (_, index) => (top / GRID_LINES) * index
  )

/** A series short enough to read day by day, each day named. */
export const isWeekSeries = (count: number): boolean => count <= LONGEST_WEEK

/** Clear space kept between two neighbouring date labels. */
const TICK_LABEL_GAP = 12
/**
 * The first day's label hangs right of its tick and the last one's left of
 * it, so a pair at either end spans a whole label and half of its neighbour.
 */
const EDGE_PAIR_LABEL_SPAN = 1.5
const WEEK_TICK_STEPS = [1, 2, 3, 6]
const DAY_TICK_STEPS = [7, 10, 14, 21]
const MONTH_TICK_STEPS = [1, 2, 3, 4, 6]

type TickSpacing = {
  count: number
  /** The width of the longest label. */
  labelWidth: number
  /** The distance between two neighbouring buckets. */
  pitch: number
}

/**
 * Every `step`-th bucket, with the smallest step whose labels sit `minPitch`
 * apart, and the last bucket too when it is as far from the label before it.
 */
const spacedTickIndexes = ({
  count,
  minPitch,
  pitch,
  steps
}: {
  count: number
  minPitch: number
  pitch: number
  steps: readonly number[]
}): number[] => {
  const step =
    steps.find((candidate) => candidate * pitch >= minPitch) ??
    Math.max(...steps)
  const last = count - 1
  const hasRoomForLast = (last % step) * pitch >= minPitch

  return Array.from({ length: count }, (_, index) => index).filter(
    (index) => index % step === 0 || (index === last && hasRoomForLast)
  )
}

/**
 * Which days get a label under the axis: every one in a week, otherwise one a
 * week, thinned further when the labels would collide.
 */
export const dayTickIndexes = ({
  count,
  labelWidth,
  pitch
}: TickSpacing): number[] =>
  spacedTickIndexes({
    count,
    minPitch: labelWidth * EDGE_PAIR_LABEL_SPAN + TICK_LABEL_GAP,
    pitch,
    steps: isWeekSeries(count) ? WEEK_TICK_STEPS : DAY_TICK_STEPS
  })

/** Months are all labelled, or thinned when their centred labels would collide. */
export const monthTickIndexes = ({
  count,
  labelWidth,
  pitch
}: TickSpacing): number[] =>
  spacedTickIndexes({
    count,
    minPitch: labelWidth + TICK_LABEL_GAP,
    pitch,
    steps: MONTH_TICK_STEPS
  })

export type ChartLayout = {
  /** The width of one month's band; a day series uses points, not bands. */
  band: number
  bottom: number
  height: number
  isNarrow: boolean
  left: number
  /** The distance between two neighbouring buckets. */
  pitch: number
  right: number
  top: number
  /** The value at the top of the axis. */
  topValue: number
  width: number
  xAt: (index: number) => number
  yAt: (value: number) => number
}

/** Where every point of a series sits in a chart `width` pixels wide. */
export const chartLayout = ({
  count,
  maximum,
  unit,
  width
}: {
  count: number
  maximum: number
  unit: BucketUnit
  width: number
}): ChartLayout => {
  const isNarrow = width < NARROW_CHART_WIDTH
  const height = isNarrow ? NARROW_HEIGHT : WIDE_HEIGHT
  const top = PLOT_TOP
  const left = VALUE_AXIS_ROOM
  const right =
    width - (isNarrow || unit === 'month' ? PLOT_RIGHT_MARGIN : END_LABEL_ROOM)
  const bottom = height - DATE_AXIS_ROOM
  const innerWidth = right - left
  const topValue = niceMaximum(maximum)
  const band = innerWidth / Math.max(count, 1)
  const pitch = unit === 'month' ? band : innerWidth / Math.max(count - 1, 1)

  return {
    band,
    bottom,
    height,
    isNarrow,
    left,
    pitch,
    right,
    top,
    topValue,
    width,
    xAt: (index) =>
      unit === 'month'
        ? left + band * index + band / 2
        : left +
          (count <= 1 ? innerWidth / 2 : (index / (count - 1)) * innerWidth),
    yAt: (value) => bottom - (value / topValue) * (bottom - top)
  }
}

/** The index under a horizontal position, clamped to the series. */
export const indexAtX = ({
  count,
  layout,
  unit,
  x
}: {
  count: number
  layout: ChartLayout
  unit: BucketUnit
  x: number
}): number => {
  const raw =
    unit === 'month'
      ? Math.floor((x - layout.left) / layout.band)
      : Math.round(
          ((x - layout.left) / (layout.right - layout.left)) * (count - 1)
        )

  return Math.max(0, Math.min(count - 1, raw))
}

/** How wide each of a month's two bars is, side by side in its band. */
export const monthBarWidth = (band: number): number =>
  Math.max(
    MONTH_BAR_MIN_WIDTH,
    Math.min(MONTH_BAR_MAX_WIDTH, (band - MONTH_BAND_PADDING) / 2)
  )
