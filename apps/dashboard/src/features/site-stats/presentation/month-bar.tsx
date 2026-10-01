import type React from 'react'

import { barPath } from '../domain/chart-paths'

/** Lifts an empty month's rule so its stroke sits on the baseline, not across it. */
const EMPTY_BAR_RAISE = 1

type MonthBarProps = {
  baseline: number
  className: string
  left: number
  top: number
  value: number
  width: number
}

/** A month with nothing in it is a short rule on the baseline, not a gap. */
export const MonthBar: React.FC<MonthBarProps> = ({
  baseline,
  className,
  left,
  top,
  value,
  width
}) =>
  value <= 0 ? (
    <line
      className='empty-bar'
      x1={left}
      x2={left + width}
      y1={baseline - EMPTY_BAR_RAISE}
      y2={baseline - EMPTY_BAR_RAISE}
    />
  ) : (
    <path className={className} d={barPath({ baseline, left, top, width })} />
  )
