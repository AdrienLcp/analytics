import type React from 'react'

import type {
  SiteStatsBreakdowns,
  Traffic
} from '@analytics/protocol/site-stats'

import { capitalizeFirst } from '@/presentation/i18n/capitalize-first'
import { useI18n } from '@/presentation/i18n/i18n-provider'

import {
  isDevice,
  isLanguageTag,
  isRegionCode,
  isTheme
} from '../domain/breakdown-keys'
import { toBreakdownRows } from '../domain/breakdown-rows'
import { BreakdownList } from './breakdown-list'

import './breakdowns.sass'

type BreakdownsProps = {
  breakdowns: SiteStatsBreakdowns
  totals: Traffic
}

const SEQUENCE_STEPS = 3

const sequenceMarker = (_key: string, index: number): string =>
  `sequence-${(index % SEQUENCE_STEPS) + 1}`

const themeMarker = (key: string): string =>
  isTheme(key) ? `theme-${key}` : 'rest'

const asWritten = (key: string): React.ReactNode => key

/**
 * The six lists under the plate. Referrers are shares of visits, since only a
 * visit arrives from somewhere; every other list is a share of page views.
 */
export const Breakdowns: React.FC<BreakdownsProps> = ({
  breakdowns,
  totals
}) => {
  const { locale, translate } = useI18n()
  const ofPageViews = translate('breakdowns.ofPageViews', {
    count: totals.pageViews
  })

  const countryLabel = (key: string): React.ReactNode =>
    isRegionCode(key) ? (
      <>
        {translate('breakdowns.country', { code: key })}
        <span className='code'>{key}</span>
      </>
    ) : (
      key
    )

  const languageLabel = (key: string): React.ReactNode =>
    isLanguageTag(key) ? (
      <>
        {capitalizeFirst({
          locale,
          text: translate('breakdowns.language', { code: key })
        })}
        <span className='code'>{key}</span>
      </>
    ) : (
      key
    )

  const themeLabel = (key: string): React.ReactNode =>
    isTheme(key) ? translate('values.theme', { theme: key }) : key

  const deviceLabel = (key: string): React.ReactNode =>
    isDevice(key) ? translate('values.device', { device: key }) : key

  return (
    <div className='breakdowns'>
      <BreakdownList
        className='half'
        labelFor={asWritten}
        otherLabel={translate('breakdowns.other.pages')}
        rows={toBreakdownRows({
          tallies: breakdowns.pages,
          total: totals.pageViews
        })}
        title={translate('breakdowns.pages')}
        totalLabel={ofPageViews}
      />
      <BreakdownList
        className='half'
        labelFor={asWritten}
        otherLabel={translate('breakdowns.other.referrers')}
        rows={toBreakdownRows({
          tallies: breakdowns.referrers,
          total: totals.visits
        })}
        title={translate('breakdowns.referrers')}
        totalLabel={translate('breakdowns.ofVisits', { count: totals.visits })}
      />
      <BreakdownList
        className='third'
        labelFor={countryLabel}
        otherLabel={translate('breakdowns.other.countries')}
        rows={toBreakdownRows({
          tallies: breakdowns.countries,
          total: totals.pageViews
        })}
        title={translate('breakdowns.countries')}
        totalLabel={ofPageViews}
      />
      <BreakdownList
        className='third'
        labelFor={languageLabel}
        otherLabel={translate('breakdowns.other.locales')}
        rows={toBreakdownRows({
          tallies: breakdowns.locales,
          total: totals.pageViews
        })}
        title={translate('breakdowns.locales')}
        totalLabel={ofPageViews}
      />
      <div className='column'>
        <BreakdownList
          labelFor={themeLabel}
          markerFor={themeMarker}
          otherLabel={translate('breakdowns.other.themes')}
          rows={toBreakdownRows({
            tallies: breakdowns.themes,
            total: totals.pageViews
          })}
          title={translate('breakdowns.themes')}
          totalLabel={ofPageViews}
        />
        <BreakdownList
          labelFor={deviceLabel}
          markerFor={sequenceMarker}
          otherLabel={translate('breakdowns.other.devices')}
          rows={toBreakdownRows({
            tallies: breakdowns.devices,
            total: totals.pageViews
          })}
          title={translate('breakdowns.devices')}
          totalLabel={ofPageViews}
        />
      </div>
    </div>
  )
}
