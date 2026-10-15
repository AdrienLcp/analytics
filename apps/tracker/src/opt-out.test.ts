import { afterEach, describe, expect, it, vi } from 'vitest'

import { isOptedOut } from './opt-out'

const visit = ({
  globalPrivacyControl,
  search = '',
  stored = new Map<string, string>()
}: {
  globalPrivacyControl?: boolean
  search?: string
  stored?: Map<string, string>
}) => {
  vi.stubGlobal('location', { search })
  vi.stubGlobal(
    'navigator',
    globalPrivacyControl === undefined ? {} : { globalPrivacyControl }
  )
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => stored.get(key) ?? null,
    removeItem: (key: string) => stored.delete(key),
    setItem: (key: string, value: string) => stored.set(key, value)
  })

  return stored
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isOptedOut', () => {
  it('[opt-out] counts a browser that refused nothing', () => {
    visit({})
    expect(isOptedOut()).toBe(false)
  })

  it('[opt-out] skips a browser whose site stored analytics:ignore', () => {
    visit({ stored: new Map([['analytics:ignore', 'true']]) })
    expect(isOptedOut()).toBe(true)
  })

  it('[opt-out] stores ?analytics=off and clears it with ?analytics=on', () => {
    const stored = visit({ search: '?analytics=off' })
    expect(isOptedOut()).toBe(true)
    expect(stored.get('analytics:ignore')).toBe('true')

    visit({ search: '?analytics=on', stored })
    expect(isOptedOut()).toBe(false)
    expect(stored.has('analytics:ignore')).toBe(false)
  })

  it('[opt-out] skips a browser that sends Global Privacy Control', () => {
    visit({ globalPrivacyControl: true })
    expect(isOptedOut()).toBe(true)
  })

  it('[opt-out] keeps Global Privacy Control over ?analytics=on', () => {
    visit({ globalPrivacyControl: true, search: '?analytics=on' })
    expect(isOptedOut()).toBe(true)
  })

  it('[opt-out] counts a browser whose Global Privacy Control is off', () => {
    visit({ globalPrivacyControl: false })
    expect(isOptedOut()).toBe(false)
  })

  it('[opt-out] still honours Global Privacy Control when storage throws', () => {
    visit({ globalPrivacyControl: true })
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('SecurityError')
      }
    })
    expect(isOptedOut()).toBe(true)
  })
})
