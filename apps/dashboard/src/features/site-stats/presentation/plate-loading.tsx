import type React from 'react'

import type { SiteId } from '@analytics/protocol/site-ids'

import { useTranslate } from '@/presentation/i18n/i18n-provider'

import { PlateFrame } from './plate-frame'
import { PlateHead } from './plate-head'
import { PlateNotice } from './plate-notice'

type PlateLoadingProps = {
  site: SiteId
}

/** The plate set and waiting for its first figures, on a cold load. */
export const PlateLoading: React.FC<PlateLoadingProps> = ({ site }) => {
  const translate = useTranslate()

  return (
    <div aria-busy='true'>
      <PlateHead
        lede={translate('loading.body', { site })}
        meta={[]}
        site={site}
      />
      <PlateFrame title={translate('loading.title')}>
        <PlateNotice isPending title={translate('loading.title')}>
          <p>{translate('loading.body', { site })}</p>
        </PlateNotice>
      </PlateFrame>
    </div>
  )
}
