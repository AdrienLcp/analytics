import { classNames } from '@adrienlcp/react'
import type React from 'react'
import { useId } from 'react'

import { useTranslate } from '@/presentation/i18n/i18n-provider'

import type { BreakdownRow } from '../domain/breakdown-rows'

import './breakdown-list.sass'

type BreakdownListProps = {
  className?: string
  /** How a listed key reads — a country's name, a theme's word. */
  labelFor: (key: string) => React.ReactNode
  /**
   * A colour key for each listed row, as a class: lists whose parts make one
   * whole show it beside each row and as a stacked bar above them.
   */
  markerFor?: (key: string, index: number) => string
  otherLabel: string
  rows: readonly BreakdownRow[]
  title: string
  /** What the shares are shares of: "of 1,234 page views". */
  totalLabel: string
}

/**
 * One ranked list under the plate: each row's count and share, a bar for its
 * share, and the rest grouped in a last row so the list adds up.
 */
export const BreakdownList: React.FC<BreakdownListProps> = ({
  className,
  labelFor,
  markerFor,
  otherLabel,
  rows,
  title,
  totalLabel
}) => {
  const translate = useTranslate()
  const titleId = useId()

  const markerOf = (row: BreakdownRow, index: number): string | undefined =>
    markerFor === undefined
      ? undefined
      : row.isOther
        ? 'rest'
        : markerFor(row.key, index)

  return (
    <section
      aria-labelledby={titleId}
      className={classNames('breakdown-list', className)}
    >
      <div className='list-head'>
        <h3 id={titleId}>{title}</h3>
        <span className='total'>{totalLabel}</span>
      </div>
      {markerFor === undefined ? null : (
        <div aria-hidden='true' className='stack'>
          {rows.map((row, index) => (
            <span
              className={markerOf(row, index)}
              key={row.isOther ? 'other' : row.key}
              style={{ '--share': row.share }}
            />
          ))}
        </div>
      )}
      <ol className='rows'>
        {rows.map((row, index) => (
          <li
            className={classNames('row', row.isOther && 'other')}
            key={row.isOther ? 'other' : row.key}
          >
            <span className='key'>
              {markerFor === undefined ? null : (
                <span
                  aria-hidden='true'
                  className={classNames('marker', markerOf(row, index))}
                />
              )}
              {row.isOther ? otherLabel : labelFor(row.key)}
            </span>
            <span className='count'>
              {translate('credits.count', { value: row.count })}
            </span>
            <span className='share'>
              {translate('breakdowns.share', { value: row.share })}
            </span>
            {markerFor === undefined ? (
              <span aria-hidden='true' className='track'>
                <span className='fill' style={{ '--share': row.share }} />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
