import type React from 'react'
import { useId } from 'react'

import { RETENTION_MONTHS } from '@analytics/protocol/retention'

import { LOCALE_KEY } from '@/infrastructure/storage/preferences-storage'
import {
  SCROLL_POSITIONS_KEY,
  VIEW_TRANSITIONS_KEY
} from '@/infrastructure/storage/session-storage-keys'
import { Link } from '@/presentation/components/link'
import { Main } from '@/presentation/components/main'
import { useI18n } from '@/presentation/i18n/i18n-provider'
import { RichText } from '@/presentation/i18n/rich-text'
import type { PlainTranslationKey } from '@/presentation/i18n/translation'

import {
  CNIL_COMPLAINT_HREF,
  HOST,
  LOG_RETENTION_DAYS,
  PUBLISHER
} from './legal-details'

import './legal-page.sass'

type BrowserKey = {
  key: string
  purpose: PlainTranslationKey
}

const BROWSER_KEYS: readonly BrowserKey[] = [
  { key: LOCALE_KEY, purpose: 'legal.device.locale' },
  { key: SCROLL_POSITIONS_KEY, purpose: 'legal.device.scroll' },
  { key: VIEW_TRANSITIONS_KEY, purpose: 'legal.device.transitions' }
]

type LegalSectionProps = {
  children: React.ReactNode
  heading: string
}

const LegalSection: React.FC<LegalSectionProps> = ({ children, heading }) => {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className='legal-section'>
      <h2 id={headingId}>{heading}</h2>
      <div className='legal-body'>{children}</div>
    </section>
  )
}

/**
 * The legal notice the French LCEN requires and the privacy policy, on the
 * one page the footer links to: who publishes the dashboard, what the browser
 * and the server keep, for how long, and what a reader can ask. What a page
 * view records is the colophon's to list, at the foot of this same page.
 */
export const LegalPage: React.FC = () => {
  const { locale, translate } = useI18n()

  const contactLink = (children: string): React.ReactNode => (
    <Link className='text-link' href={PUBLISHER.contactHrefFor[locale]}>
      {children}
    </Link>
  )
  const cnilLink = (children: string): React.ReactNode => (
    <Link className='text-link' href={CNIL_COMPLAINT_HREF}>
      {children}
    </Link>
  )

  return (
    <Main className='legal-page'>
      <div className='legal-head'>
        <h1>{translate('legal.title')}</h1>
        <p>{translate('legal.intro')}</p>
      </div>

      <div className='legal-sections'>
        <LegalSection heading={translate('legal.publisher.heading')}>
          <p>
            <RichText
              parts={translate.rich('legal.publisher.body', {
                contact: contactLink,
                name: PUBLISHER.name
              })}
            />
          </p>
          <p>{translate('legal.publisher.address')}</p>
        </LegalSection>

        <LegalSection heading={translate('legal.host.heading')}>
          <p>{translate('legal.host.body')}</p>
          <address className='host-address'>
            {[HOST.name, ...HOST.addressLines].map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </LegalSection>

        <LegalSection heading={translate('legal.device.heading')}>
          <p>{translate('legal.device.body')}</p>
          <dl className='stored-keys'>
            {BROWSER_KEYS.map(({ key, purpose }) => (
              <div key={key}>
                <dt>
                  <code>{key}</code>
                </dt>
                <dd>{translate(purpose)}</dd>
              </div>
            ))}
          </dl>
        </LegalSection>

        <LegalSection heading={translate('legal.server.heading')}>
          <p>
            {translate('legal.server.pageViews', {
              colophon: translate('colophon.title')
            })}
          </p>
          <p>{translate('legal.server.viewKey')}</p>
          <p>
            {translate('legal.server.retention', { months: RETENTION_MONTHS })}
          </p>
          <p>{translate('legal.server.logs', { days: LOG_RETENTION_DAYS })}</p>
        </LegalSection>

        <LegalSection heading={translate('legal.measurement.heading')}>
          <p>{translate('legal.measurement.body')}</p>
          <p>{translate('legal.measurement.sites')}</p>
        </LegalSection>

        <LegalSection heading={translate('legal.thirdParties.heading')}>
          <p>{translate('legal.thirdParties.body')}</p>
        </LegalSection>

        <LegalSection heading={translate('legal.rights.heading')}>
          <p>
            <RichText
              parts={translate.rich('legal.rights.body', {
                contact: contactLink
              })}
            />
          </p>
          <p>
            <RichText
              parts={translate.rich('legal.rights.complaint', {
                authority: cnilLink
              })}
            />
          </p>
        </LegalSection>
      </div>
    </Main>
  )
}
