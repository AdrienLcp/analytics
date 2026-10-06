import type React from 'react'
import { useId } from 'react'

import { Icon } from '@/presentation/components/icon'
import { useTranslate } from '@/presentation/i18n/i18n-provider'
import { RichText, strong } from '@/presentation/i18n/rich-text'
import type { PlainTranslationKey } from '@/presentation/i18n/translation'

import './privacy-colophon.sass'

type ColophonEntry = {
  name: PlainTranslationKey
  note: PlainTranslationKey
}

const RECORDED: readonly ColophonEntry[] = [
  { name: 'colophon.recorded.path', note: 'colophon.recorded.pathNote' },
  {
    name: 'colophon.recorded.referrer',
    note: 'colophon.recorded.referrerNote'
  },
  { name: 'colophon.recorded.country', note: 'colophon.recorded.countryNote' },
  {
    name: 'colophon.recorded.language',
    note: 'colophon.recorded.languageNote'
  },
  { name: 'colophon.recorded.theme', note: 'colophon.recorded.themeNote' },
  { name: 'colophon.recorded.device', note: 'colophon.recorded.deviceNote' },
  { name: 'colophon.recorded.speed', note: 'colophon.recorded.speedNote' }
]

const NEVER_RECORDED: readonly ColophonEntry[] = [
  { name: 'colophon.never.cookie', note: 'colophon.never.cookieNote' },
  { name: 'colophon.never.ip', note: 'colophon.never.ipNote' },
  { name: 'colophon.never.userAgent', note: 'colophon.never.userAgentNote' },
  {
    name: 'colophon.never.fingerprint',
    note: 'colophon.never.fingerprintNote'
  },
  { name: 'colophon.never.referrer', note: 'colophon.never.referrerNote' },
  { name: 'colophon.never.query', note: 'colophon.never.queryNote' }
]

/**
 * The privacy claim, stated as plainly for what is dropped as for what is
 * kept. Every line has to stay true to the tracker and the Worker: a column
 * added to `page_views` or `web_vital_buckets` is a line added here.
 */
export const PrivacyColophon: React.FC = () => {
  const translate = useTranslate()
  const titleId = useId()

  return (
    <div className='privacy-colophon'>
      <section aria-labelledby={titleId} className='colophon'>
        <h2 id={titleId}>{translate('colophon.title')}</h2>
        <div className='list'>
          <h3>{translate('colophon.recorded.title')}</h3>
          <ul>
            {RECORDED.map((entry) => (
              <li key={entry.name}>
                <Icon name='check' />
                <span>
                  {translate(entry.name)}
                  <small>{translate(entry.note)}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className='list'>
          <h3>{translate('colophon.never.title')}</h3>
          <ul>
            {NEVER_RECORDED.map((entry) => (
              <li key={entry.name}>
                <Icon name='never' />
                <span>
                  {translate(entry.name)}
                  <small>{translate(entry.note)}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className='definition'>
          <RichText
            parts={translate.rich('colophon.definition', { b: strong })}
          />
        </p>
      </section>
    </div>
  )
}
