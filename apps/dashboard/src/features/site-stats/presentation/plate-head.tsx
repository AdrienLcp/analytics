import type React from 'react'
import { useId } from 'react'

import type { SiteId } from '@analytics/protocol/site-ids'

import './plate-head.sass'

type PlateHeadProps = {
  /** The sentence beside the name: what the plate shows, or why it is blank. */
  lede: React.ReactNode
  /** Short caption lines under the name — the range, the bucketing. */
  meta: readonly string[]
  site: SiteId
}

/** The plate's title: the site's name set as large as the annual allows. */
export const PlateHead: React.FC<PlateHeadProps> = ({ lede, meta, site }) => {
  const titleId = useId()

  return (
    <section aria-labelledby={titleId} className='plate-head'>
      <h1 id={titleId}>{site}</h1>
      <p className='lede'>{lede}</p>
      <div className='meta'>
        {meta.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </section>
  )
}
