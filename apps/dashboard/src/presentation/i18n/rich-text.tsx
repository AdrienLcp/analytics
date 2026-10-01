import type React from 'react'
import { createElement, Fragment } from 'react'

type RichTextProps = {
  /** What `translate.rich` returned, in order. */
  parts: readonly React.ReactNode[]
}

/** Spreads the parts as arguments, so React asks none of them for a key. */
export const RichText: React.FC<RichTextProps> = ({ parts }) =>
  createElement(Fragment, null, ...parts)

export const strong = (children: string): React.ReactNode => (
  <strong>{children}</strong>
)
