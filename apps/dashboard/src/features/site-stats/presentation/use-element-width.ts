import type React from 'react'
import { useState } from 'react'

/**
 * The rendered width of the element the returned ref is attached to, kept up
 * to date as the layout changes. `0` until the first measure.
 */
export const useElementWidth = <TElement extends HTMLElement>(): [
  React.RefCallback<TElement>,
  number
] => {
  const [width, setWidth] = useState(0)

  const measure = (element: TElement | null) => {
    if (element === null) return

    const observer = new ResizeObserver(([entry]) => {
      if (entry !== undefined) setWidth(Math.round(entry.contentRect.width))
    })
    observer.observe(element)

    return () => observer.disconnect()
  }

  return [measure, width]
}
