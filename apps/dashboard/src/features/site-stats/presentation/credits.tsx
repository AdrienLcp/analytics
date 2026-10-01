import type React from 'react'

import { useTranslate } from '@/presentation/i18n/i18n-provider'

import './credits.sass'

export type Credit = {
  label: string
  /** The line under the figure: what it counts, or what it is waiting for. */
  note: string
  /** The chart line this figure totals, keyed by the same colour. */
  series?: 'page-views' | 'visits'
  /** `null` when there is nothing to show yet, drawn as a dash. */
  value: string | null
}

type CreditsProps = {
  credits: readonly Credit[]
}

/** The plate's printed credits: four figures ruled under the title. */
export const Credits: React.FC<CreditsProps> = ({ credits }) => {
  const translate = useTranslate()

  return (
    <dl aria-label={translate('credits.label')} className='credits'>
      {credits.map((credit) => (
        <div className='credit' key={credit.label}>
          <dt>
            {credit.series === undefined ? null : (
              <span aria-hidden='true' className={`swatch ${credit.series}`} />
            )}
            {credit.label}
          </dt>
          <dd>
            {credit.value === null ? (
              <>
                <span aria-hidden='true'>—</span>
                <span className='visually-hidden'>
                  {translate('credits.notAvailable')}
                </span>
              </>
            ) : (
              credit.value
            )}
            <small>{credit.note}</small>
          </dd>
        </div>
      ))}
    </dl>
  )
}
