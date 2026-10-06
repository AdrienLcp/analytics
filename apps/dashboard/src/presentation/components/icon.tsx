import { Ban, Check, ChevronRight, type LucideIcon } from 'lucide-react'
import type React from 'react'

import './icon.sass'

const ICON_GLYPHS = {
  check: Check,
  disclosure: ChevronRight,
  never: Ban
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICON_GLYPHS

type IconProps = {
  name: IconName
}

/**
 * A decorative icon: the text beside it carries the meaning. `icon.sass`
 * draws every glyph at the plate's hairline weight, whatever its size.
 */
export const Icon: React.FC<IconProps> = ({ name }) => {
  const Glyph = ICON_GLYPHS[name]

  return <Glyph aria-hidden='true' className='icon' focusable='false' />
}
