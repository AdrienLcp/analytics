import type React from 'react'
import { useId } from 'react'

import type { SiteId } from '@analytics/protocol/site-ids'
import type {
  SiteStatsResponse,
  StatsPeriod
} from '@analytics/protocol/site-stats'
import {
  TRACKER_FILE_NAME,
  TRACKER_SITE_DATA_KEY
} from '@analytics/protocol/tracker-script'

import { currentOrigin } from '@/infrastructure/browser'
import { useTranslate } from '@/presentation/i18n/i18n-provider'
import { RichText, strong } from '@/presentation/i18n/rich-text'
import type { PlainTranslationKey } from '@/presentation/i18n/translation'

import { PERIOD_UNIT } from '../domain/bucket'
import { axisTicks } from './axis-ticks'
import { Credits } from './credits'
import { PlateFrame } from './plate-frame'
import { PlateHead } from './plate-head'
import { PlateNotice } from './plate-notice'
import { rangeLabel } from './plate-range'
import { SectionHead } from './section-head'
import { useElementWidth } from './use-element-width'
import { useTextWidth } from './use-text-width'

import './empty-plate.sass'

type PendingList = {
  description: PlainTranslationKey
  span: 'half' | 'third'
  title: PlainTranslationKey
}

const PENDING_LISTS: readonly PendingList[] = [
  {
    description: 'empty.pending.pages',
    span: 'half',
    title: 'breakdowns.pages'
  },
  {
    description: 'empty.pending.referrers',
    span: 'half',
    title: 'breakdowns.referrers'
  },
  {
    description: 'empty.pending.countries',
    span: 'third',
    title: 'breakdowns.countries'
  },
  {
    description: 'empty.pending.locales',
    span: 'third',
    title: 'breakdowns.locales'
  },
  {
    description: 'empty.pending.themesAndDevices',
    span: 'third',
    title: 'empty.themesAndDevices'
  }
]

type EmptyPlateProps = {
  period: StatsPeriod
  site: SiteId
  stats: SiteStatsResponse
}

/**
 * A site with no page view in the period. Every figure is an honest zero, and
 * the plate says what will fill it and how to start: the one tag to install.
 */
export const EmptyPlate: React.FC<EmptyPlateProps> = ({
  period,
  site,
  stats
}) => {
  const translate = useTranslate()
  const listsTitleId = useId()
  const unit = PERIOD_UNIT[period]
  const { series } = stats
  const count = series.length
  const [measureAxis, axisWidth] = useElementWidth<HTMLDivElement>()
  const [readAxisFont, textWidth] = useTextWidth<HTMLDivElement>()
  const axis = axisTicks({
    namesWeekdays: false,
    pitch: axisWidth / Math.max(count - 1, 1),
    series,
    textWidth,
    translate,
    unit
  })
  const trackerUrl = new URL(TRACKER_FILE_NAME, currentOrigin()).href

  return (
    <>
      <PlateHead
        lede={
          <RichText
            parts={translate.rich('empty.lede', {
              b: strong,
              site,
              span: translate('period.span', { period })
            })}
          />
        }
        meta={[
          rangeLabel({ series, translate, unit }),
          translate('empty.waiting')
        ]}
        site={site}
      />
      <Credits
        credits={[
          {
            label: translate('credits.pageViews'),
            note: translate('credits.noneYet'),
            series: 'page-views',
            value: translate('credits.count', { value: 0 })
          },
          {
            label: translate('credits.visits'),
            note: translate('credits.noneYet'),
            series: 'visits',
            value: translate('credits.count', { value: 0 })
          },
          {
            label: translate('credits.pagesPerVisit'),
            note: translate('credits.needsVisit'),
            value: null
          },
          {
            label: translate('credits.busiest', { unit }),
            note: translate('credits.needsPageView'),
            value: null
          }
        ]}
      />
      <PlateFrame title={translate('plate.title', { unit })}>
        <PlateNotice
          axis={
            <div
              aria-hidden='true'
              className='empty-axis'
              ref={(axis) => {
                readAxisFont(axis)
                return measureAxis(axis)
              }}
            >
              {axis.map((tick) => (
                <span key={tick.key}>{tick.label}</span>
              ))}
            </div>
          }
          baseline={
            <span aria-hidden='true' className='empty-zero'>
              {translate('credits.count', { value: 0 })}
            </span>
          }
          title={translate('empty.title')}
        >
          <p>
            {unit === 'day'
              ? translate('empty.bodyDays', { count, site })
              : translate('empty.bodyMonths', { count, site })}
          </p>
          <figure className='snippet'>
            <pre>
              {`<script defer data-${TRACKER_SITE_DATA_KEY}="${site}"\n  src="${trackerUrl}"></script>`}
            </pre>
            <figcaption>{translate('empty.snippetLabel')}</figcaption>
          </figure>
        </PlateNotice>
      </PlateFrame>
      <section aria-labelledby={listsTitleId}>
        <SectionHead
          id={listsTitleId}
          lede={translate('empty.breakdownsLede')}
          title={translate('empty.breakdownsTitle')}
        />
        <div className='pending-lists'>
          {PENDING_LISTS.map((list) => (
            <section className={`pending-list ${list.span}`} key={list.title}>
              <div className='list-head'>
                <h3>{translate(list.title)}</h3>
                <span className='total'>{translate('empty.recorded')}</span>
              </div>
              <div aria-hidden='true' className='pending-bar' />
              <p className='description'>
                <span>{translate(list.description)}</span>
                <span aria-hidden='true'>—</span>
              </p>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}
