import { describe, expect, it } from 'vitest'

import { capitalizeFirst } from './capitalize-first'

describe('capitalizeFirst', () => {
  it('[i18n] capitalises a display name Intl writes lowercase', () => {
    expect(capitalizeFirst({ locale: 'fr', text: 'français (France)' })).toBe(
      'Français (France)'
    )
  })

  it('[i18n] capitalises the way the locale does', () => {
    expect(capitalizeFirst({ locale: 'tr', text: 'ingilizce' })).toBe(
      'İngilizce'
    )
  })

  it('[i18n] keeps a first letter written with a combining accent whole', () => {
    expect(capitalizeFirst({ locale: 'fr', text: 'écossais' })).toBe('Écossais')
  })

  it('[i18n] leaves empty text and capitals as they are', () => {
    expect(capitalizeFirst({ locale: 'en', text: '' })).toBe('')
    expect(capitalizeFirst({ locale: 'en', text: 'English' })).toBe('English')
  })
})
