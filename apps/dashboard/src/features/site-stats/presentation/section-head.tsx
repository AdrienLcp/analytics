import type React from 'react'

import './section-head.sass'

type SectionHeadProps = {
  /** Set as the `h2` the section below is labelled by. */
  id: string
  lede: string
  title: string
}

/** A section opening in the annual: the title on the left, a short note on the right. */
export const SectionHead: React.FC<SectionHeadProps> = ({
  id,
  lede,
  title
}) => (
  <div className='section-head'>
    <h2 id={id}>{title}</h2>
    <p>{lede}</p>
  </div>
)
