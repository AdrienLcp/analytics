import type React from 'react'
import { useEffect, useState } from 'react'

type TextStyle = {
  font: string
  /** In pixels; browsers add it after every character. */
  letterSpacing: number
}

let measuringContext: CanvasRenderingContext2D | null = null

const canvasContext = (): CanvasRenderingContext2D | null => {
  measuringContext ??= document.createElement('canvas').getContext('2d')
  return measuringContext
}

const textStyleOf = (element: Element): TextStyle => {
  const style = getComputedStyle(element)
  const letterSpacing = Number.parseFloat(style.letterSpacing)

  return {
    font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
    letterSpacing: Number.isNaN(letterSpacing) ? 0 : letterSpacing
  }
}

const isSameStyle = (a: TextStyle | null, b: TextStyle): boolean =>
  a?.font === b.font && a.letterSpacing === b.letterSpacing

/**
 * How wide a text is in the font of the element the returned ref is attached
 * to, measured through a canvas and measured again once the web fonts have
 * loaded. `0` until the element is attached.
 */
export const useTextWidth = <TElement extends Element>(): [
  React.RefCallback<TElement>,
  (text: string) => number
] => {
  const [style, setStyle] = useState<TextStyle | null>(null)

  useEffect(() => {
    let isCurrent = true
    document.fonts.ready.then(() => {
      if (isCurrent) setStyle((current) => current && { ...current })
    })

    return () => {
      isCurrent = false
    }
  }, [])

  const readStyle = (element: TElement | null) => {
    if (element === null) return

    const next = textStyleOf(element)
    setStyle((current) => (isSameStyle(current, next) ? current : next))
  }

  const textWidth = (text: string): number => {
    const context = canvasContext()
    if (style === null || context === null) return 0

    context.font = style.font
    return context.measureText(text).width + style.letterSpacing * text.length
  }

  return [readStyle, textWidth]
}
