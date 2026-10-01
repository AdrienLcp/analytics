import type React from 'react'
import { useId } from 'react'

import { SITE_IDS } from '@analytics/protocol/site-ids'
import { STATS_PERIODS } from '@analytics/protocol/site-stats'

import {
  DEFAULT_SITE,
  sitePathFor,
  useLocationPeriod,
  useLocationSite
} from '@/infrastructure/router/navigation'
import { Group } from '@/presentation/components/group'
import { Link } from '@/presentation/components/link'
import {
  ToggleButton,
  ToggleButtonGroup
} from '@/presentation/components/toggle-button-group'
import { useI18n } from '@/presentation/i18n/i18n-provider'
import {
  isLocale,
  LANGUAGE_NAMES,
  LOCALES,
  type Locale
} from '@/presentation/i18n/locales'

import './token-bar.sass'

/** Switching site or period swaps the plate in place, like a tab. */
const TAB_LIKE = { preventScrollReset: true, replace: true } as const

const chosenLocale = (keys: Iterable<unknown>): Locale | undefined =>
  [...keys].find(
    (key): key is Locale => typeof key === 'string' && isLocale(key)
  )

/**
 * The bar the whole dashboard is driven from: which site, over which period,
 * in which language. Site and period are links, so the address always names
 * what is on screen; the language is this device's preference.
 */
export const TokenBar: React.FC = () => {
  const { locale, setLocale, translate } = useI18n()
  const currentSite = useLocationSite()
  const currentPeriod = useLocationPeriod()
  const siteLabelId = useId()
  const periodLabelId = useId()
  const languageLabelId = useId()

  return (
    <div className='token-bar'>
      <nav aria-label={translate('controls.label')} className='bar-inner'>
        <Group aria-labelledby={siteLabelId} className='group site'>
          <span className='group-label' id={siteLabelId}>
            {translate('controls.site')}
          </span>
          <div className='tokens'>
            {SITE_IDS.map((site) => (
              <Link
                aria-current={site === currentSite ? 'page' : undefined}
                className='token'
                href={sitePathFor({ period: currentPeriod, site })}
                key={site}
                routerOptions={TAB_LIKE}
              >
                {site}
              </Link>
            ))}
          </div>
        </Group>
        <Group aria-labelledby={periodLabelId} className='group period'>
          <span className='group-label' id={periodLabelId}>
            {translate('controls.period')}
          </span>
          <div className='tokens'>
            {STATS_PERIODS.map((period) => (
              <Link
                aria-current={
                  currentSite !== null && period === currentPeriod
                    ? 'page'
                    : undefined
                }
                aria-label={translate('period.long', { period })}
                className='token'
                href={sitePathFor({
                  period,
                  site: currentSite ?? DEFAULT_SITE
                })}
                key={period}
                routerOptions={TAB_LIKE}
              >
                {translate('period.short', { period })}
              </Link>
            ))}
          </div>
        </Group>
        <div className='group language'>
          <span className='group-label' id={languageLabelId}>
            {translate('controls.language')}
          </span>
          <ToggleButtonGroup
            aria-labelledby={languageLabelId}
            className='tokens'
            disallowEmptySelection
            onSelectionChange={(keys) => {
              const next = chosenLocale(keys)
              if (next !== undefined) setLocale(next)
            }}
            selectedKeys={[locale]}
            selectionMode='single'
          >
            {LOCALES.map((option) => (
              <ToggleButton
                aria-label={LANGUAGE_NAMES[option]}
                className='token'
                id={option}
                key={option}
                lang={option}
              >
                {option}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      </nav>
    </div>
  )
}
