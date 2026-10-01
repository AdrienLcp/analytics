import type React from 'react'
import { useId } from 'react'

import type { SiteId } from '@analytics/protocol/site-ids'
import type {
  SiteStatsResponse,
  StatsPeriod
} from '@analytics/protocol/site-stats'

import { useTranslate } from '@/presentation/i18n/i18n-provider'
import { RichText, strong } from '@/presentation/i18n/rich-text'

import { bucketStart, PERIOD_UNIT } from '../domain/bucket'
import { busiestBucket, pagesPerVisit } from '../domain/traffic-summary'
import { Breakdowns } from './breakdowns'
import { Credits } from './credits'
import { PlateFrame } from './plate-frame'
import { PlateHead } from './plate-head'
import { rangeLabel } from './plate-range'
import { SectionHead } from './section-head'
import { TrafficChart } from './traffic-chart'
import { TrafficTable } from './traffic-table'

type FullPlateProps = {
  period: StatsPeriod
  site: SiteId
  stats: SiteStatsResponse
}

/** A site with figures: the head, the credits, the plate, and the lists. */
export const FullPlate: React.FC<FullPlateProps> = ({
  period,
  site,
  stats
}) => {
  const translate = useTranslate()
  const breakdownsTitleId = useId()
  const unit = PERIOD_UNIT[period]
  const { series, totals } = stats
  const range = rangeLabel({ series, translate, unit })
  const ratio = pagesPerVisit(totals)
  const busiest = busiestBucket(series)
  const busiestStart =
    busiest === null ? null : bucketStart({ bucket: busiest.bucket, unit })

  return (
    <>
      <PlateHead
        lede={
          <RichText
            parts={translate.rich('head.lede', {
              b: strong,
              site,
              span: translate('period.span', { period })
            })}
          />
        }
        meta={[range, translate('head.bucketing', { unit })]}
        site={site}
      />
      <Credits
        credits={[
          {
            label: translate('credits.pageViews'),
            note: translate('credits.pageViewsNote'),
            series: 'page-views',
            value: translate('credits.count', { value: totals.pageViews })
          },
          {
            label: translate('credits.visits'),
            note: translate('credits.visitsNote'),
            series: 'visits',
            value: translate('credits.count', { value: totals.visits })
          },
          {
            label: translate('credits.pagesPerVisit'),
            note:
              ratio === null
                ? translate('credits.needsVisit')
                : translate('credits.pagesPerVisitNote'),
            value:
              ratio === null
                ? null
                : translate('credits.pagesPerVisitValue', { value: ratio })
          },
          {
            label: translate('credits.busiest', { unit }),
            note:
              busiest === null
                ? translate('credits.needsPageView')
                : translate('credits.busiestNote', {
                    count: busiest.pageViews
                  }),
            value:
              busiestStart === null
                ? null
                : unit === 'day'
                  ? translate('credits.busiestDay', { day: busiestStart })
                  : translate('credits.busiestMonth', { month: busiestStart })
          }
        ]}
      />
      <PlateFrame title={translate('plate.title', { unit })}>
        <TrafficChart
          series={series}
          summary={translate('chart.summary', {
            pageViews: totals.pageViews,
            per: unit,
            range,
            unit,
            visits: totals.visits
          })}
          unit={unit}
        />
        <TrafficTable range={range} series={series} unit={unit} />
      </PlateFrame>
      <section aria-labelledby={breakdownsTitleId}>
        <SectionHead
          id={breakdownsTitleId}
          lede={translate('breakdowns.lede')}
          title={translate('breakdowns.title', { count: totals.pageViews })}
        />
        <Breakdowns breakdowns={stats.breakdowns} totals={totals} />
      </section>
    </>
  )
}
