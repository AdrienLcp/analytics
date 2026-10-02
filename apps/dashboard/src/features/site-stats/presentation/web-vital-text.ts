import type { WebVitalMetric } from '@analytics/protocol/web-vitals'

import type { Translate } from '@/presentation/i18n/translation'

type WebVitalFormatter = (input: {
  translate: Translate
  value: number
}) => string

const MS_PER_SECOND = 1000

/** LCP reads in seconds, INP in milliseconds, CLS as a bare score. */
const VALUE_TEXT = {
  cls: ({ translate, value }) => translate('speed.value.cls', { value }),
  inp: ({ translate, value }) => translate('speed.value.inp', { value }),
  lcp: ({ translate, value }) =>
    translate('speed.value.lcp', { value: value / MS_PER_SECOND })
} satisfies Record<WebVitalMetric, WebVitalFormatter>

const TICK_TEXT = {
  cls: ({ translate, value }) => translate('speed.tick.cls', { value }),
  inp: ({ translate, value }) => translate('speed.tick.inp', { value }),
  lcp: ({ translate, value }) =>
    translate('speed.tick.lcp', { value: value / MS_PER_SECOND })
} satisfies Record<WebVitalMetric, WebVitalFormatter>

/** A measured value as the credit shows it: "1.9 s", "40 ms", "0.19". */
export const webVitalValueText = ({
  metric,
  translate,
  value
}: {
  metric: WebVitalMetric
  translate: Translate
  value: number
}): string => VALUE_TEXT[metric]({ translate, value })

/** A threshold as its scale labels it, with no padding decimals: "2.5 s", "4 s". */
export const webVitalTickText = ({
  metric,
  translate,
  value
}: {
  metric: WebVitalMetric
  translate: Translate
  value: number
}): string => TICK_TEXT[metric]({ translate, value })
