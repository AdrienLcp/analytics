import type React from 'react'

import {
  WEB_VITAL_METRICS,
  type WebVitalMetric,
  type WebVitalSummary,
  type WebVitalsSummary
} from '@analytics/protocol/web-vitals'

import { useTranslate } from '@/presentation/i18n/i18n-provider'
import { RichText, strong } from '@/presentation/i18n/rich-text'

import { rateWebVital } from '../domain/web-vital-rating'
import { ThresholdScale } from './threshold-scale'
import { webVitalValueText } from './web-vital-text'

import './speed-credits.sass'

type SpeedCreditProps = {
  metric: WebVitalMetric
  summary: WebVitalSummary
}

const SpeedCredit: React.FC<SpeedCreditProps> = ({ metric, summary }) => {
  const translate = useTranslate()
  const name = translate('speed.name', { metric })
  const question = translate('speed.question', { metric })
  const { p75 } = summary

  return (
    <div className='credit'>
      <dt>
        {name}
        <abbr title={name}>{translate('speed.abbr', { metric })}</abbr>
      </dt>
      <dd className='value'>
        {p75 === null ? (
          <>
            <span aria-hidden='true'>—</span>
            <span className='visually-hidden'>
              {translate('credits.notAvailable')}
            </span>
          </>
        ) : (
          webVitalValueText({ metric, translate, value: p75 })
        )}
      </dd>
      {p75 === null ? (
        <dd className='verdict unmeasured'>
          {translate('speed.verdictEmpty')}
        </dd>
      ) : (
        <dd className='verdict'>
          {translate('speed.verdict', {
            rating: rateWebVital({ metric, value: p75 })
          })}
        </dd>
      )}
      <dd>
        <ThresholdScale metric={metric} value={p75} />
        <small>
          {summary.samples === 0 ? (
            translate('speed.noteEmpty', { question })
          ) : (
            <RichText
              parts={translate.rich('speed.note', {
                b: strong,
                question,
                samples: summary.samples
              })}
            />
          )}
        </small>
      </dd>
    </div>
  )
}

type SpeedCreditsProps = {
  webVitals: WebVitalsSummary
}

/**
 * The three Core Web Vitals as a row of credits: each figure, its verdict in
 * words, and where it falls between Google's thresholds.
 */
export const SpeedCredits: React.FC<SpeedCreditsProps> = ({ webVitals }) => {
  const translate = useTranslate()

  return (
    <dl aria-label={translate('speed.label')} className='speed-credits'>
      {WEB_VITAL_METRICS.map((metric) => (
        <SpeedCredit key={metric} metric={metric} summary={webVitals[metric]} />
      ))}
    </dl>
  )
}
