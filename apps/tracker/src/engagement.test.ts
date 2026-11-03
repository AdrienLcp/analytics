import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { onFirstEngagement } from './engagement'

const openPage = () => {
  const page = new EventTarget()
  const visibility = { visibilityState: 'visible' }

  vi.stubGlobal('addEventListener', page.addEventListener.bind(page))
  vi.stubGlobal('removeEventListener', page.removeEventListener.bind(page))
  vi.stubGlobal('document', visibility)

  const engage = vi.fn()
  onFirstEngagement(engage)

  return {
    engage,
    gesture: (type = 'pointerdown') => page.dispatchEvent(new Event(type)),
    hide: () => {
      visibility.visibilityState = 'hidden'
      page.dispatchEvent(new Event('visibilitychange'))
    }
  }
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['performance'] })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('onFirstEngagement', () => {
  it('[engagement] engages at the first gesture once the page view had time to land', () => {
    const page = openPage()

    vi.advanceTimersByTime(1000)
    page.gesture('keydown')

    expect(page.engage).toHaveBeenCalledOnce()
  })

  it('[engagement] skips a gesture right after the page view and counts the next', () => {
    const page = openPage()

    page.gesture()
    expect(page.engage).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1000)
    page.gesture('wheel')
    expect(page.engage).toHaveBeenCalledOnce()
  })

  it('[engagement] engages when the page is hidden, however soon', () => {
    const page = openPage()

    page.hide()

    expect(page.engage).toHaveBeenCalledOnce()
  })

  it('[engagement] engages once, whatever follows', () => {
    const page = openPage()

    vi.advanceTimersByTime(1000)
    page.gesture()
    page.gesture('keydown')
    page.hide()

    expect(page.engage).toHaveBeenCalledOnce()
  })

  it('[engagement] never engages a page nobody touched or left', () => {
    const page = openPage()

    vi.advanceTimersByTime(60_000)
    page.gesture('scroll')

    expect(page.engage).not.toHaveBeenCalled()
  })
})
