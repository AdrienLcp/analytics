import { classNames } from '@adrienlcp/react'
import type React from 'react'
import { useId } from 'react'

import { RegistrationMark } from '@/presentation/components/registration-mark'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

import { PlateStamp } from './plate-stamp'

import './plate-frame.sass'

type PlateFrameProps = {
  /** The chart, or what stands in for it while it cannot be drawn. */
  children: React.ReactNode
  title: string
}

const CORNERS = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right'
] as const

/**
 * The plate itself: a ruled frame pinned at its corners by registration marks,
 * the stamp pressed over its top edge, the caption and its legend inside.
 */
export const PlateFrame: React.FC<PlateFrameProps> = ({ children, title }) => {
  const translate = useTranslate()
  const titleId = useId()

  return (
    <figure aria-labelledby={titleId} className='plate-frame'>
      {CORNERS.map((corner) => (
        <RegistrationMark
          className={classNames('registration', corner)}
          key={corner}
        />
      ))}
      <PlateStamp />
      <figcaption className='plate-caption'>
        <h2 id={titleId}>{title}</h2>
        <div aria-hidden='true' className='legend'>
          <span>
            <i className='page-views' />
            {translate('credits.pageViews')}
          </span>
          <span>
            <i className='visits' />
            {translate('credits.visits')}
          </span>
        </div>
      </figcaption>
      {children}
    </figure>
  )
}
