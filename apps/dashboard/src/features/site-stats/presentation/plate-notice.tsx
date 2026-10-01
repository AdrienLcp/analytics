import type React from 'react'

import './plate-notice.sass'

type PlateNoticeProps = {
  /** Under the field: the axis an empty chart would have. */
  axis?: React.ReactNode
  /** The sentences and controls under the title. */
  children: React.ReactNode
  /** Pinned to the field's baseline, where the zero of an axis sits. */
  baseline?: React.ReactNode
  /** Breathes slowly while something is on its way. */
  isPending?: boolean
  title: string
}

/**
 * What the plate shows when it has no chart to show: the dotted ground the
 * chart would be drawn on, and a note set on it saying why.
 */
export const PlateNotice: React.FC<PlateNoticeProps> = ({
  axis,
  baseline,
  children,
  isPending = false,
  title
}) => (
  <div className={isPending ? 'plate-notice is-pending' : 'plate-notice'}>
    <div className='field'>
      <div className='copy'>
        <h3>{title}</h3>
        {children}
      </div>
      {baseline}
    </div>
    {axis}
  </div>
)
