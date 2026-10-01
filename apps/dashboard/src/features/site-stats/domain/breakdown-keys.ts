import {
  DEVICES,
  type Device,
  THEMES,
  type Theme
} from '@analytics/protocol/page-view'

const REGION_CODE = /^[A-Z]{2}$/

/** An ISO 3166 alpha-2 code, the only kind `Intl.DisplayNames` names as a region. */
export const isRegionCode = (key: string): boolean => REGION_CODE.test(key)

/**
 * The tracker stores `navigator.language` as the browser reports it, and the
 * API only caps its length: a tag `Intl` rejects is shown as written instead
 * of failing the whole list.
 */
export const isLanguageTag = (key: string): boolean => {
  try {
    return Intl.getCanonicalLocales(key).length === 1
  } catch {
    return false
  }
}

export const isTheme = (key: string): key is Theme =>
  THEMES.some((theme) => theme === key)

export const isDevice = (key: string): key is Device =>
  DEVICES.some((device) => device === key)
