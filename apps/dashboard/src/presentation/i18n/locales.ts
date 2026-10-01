/** The languages the dashboard is written in; the first is the reference. */
export const LOCALES = ['en', 'fr'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE = 'en' satisfies Locale

export const isLocale = (value: string): value is Locale =>
  LOCALES.some((locale) => locale === value)

/**
 * A language is named in its own language and never translated: someone who
 * landed on a page they cannot read has only the word itself to go by.
 */
export const LANGUAGE_NAMES = {
  en: 'English',
  fr: 'Français'
} as const satisfies Record<Locale, string>
