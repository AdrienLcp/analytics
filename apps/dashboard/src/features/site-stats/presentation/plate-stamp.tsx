import type React from 'react'
import { useId } from 'react'

import { useTranslate } from '@/presentation/i18n/i18n-provider'

const RING_TEXT_LENGTH = 312
const RING_FONT_SIZE = 9.4
const RING_LETTER_SPACING = 1.1

/**
 * The annual's seal, pressed over the plate's top edge: the privacy promise
 * set around a crossed-out circle, slowly turning. Decorative — the colophon
 * says the same in full sentences.
 */
export const PlateStamp: React.FC = () => {
  const translate = useTranslate()
  const ringId = `stamp-ring${useId().replace(/[^\w-]/g, '')}`

  return (
    <svg
      aria-hidden='true'
      className='plate-stamp'
      focusable='false'
      viewBox='0 0 132 132'
    >
      <circle className='seal' cx='66' cy='66' r='65' />
      <circle className='rule' cx='66' cy='66' r='64.5' />
      <circle className='rule' cx='66' cy='66' r='40' />
      <defs>
        <path
          d='M66 66 m-50 0 a50 50 0 1 1 100 0 a50 50 0 1 1 -100 0'
          id={ringId}
        />
      </defs>
      <g className='ring'>
        <text fontSize={RING_FONT_SIZE} letterSpacing={RING_LETTER_SPACING}>
          <textPath
            href={`#${ringId}`}
            lengthAdjust='spacing'
            textLength={RING_TEXT_LENGTH}
          >
            {translate('plate.stamp')}
          </textPath>
        </text>
      </g>
      <g className='mark'>
        <circle cx='66' cy='66' r='14' />
        <path d='M56 76L76 56' />
      </g>
    </svg>
  )
}
