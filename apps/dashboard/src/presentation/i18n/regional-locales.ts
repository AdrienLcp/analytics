import type { Locale } from './locales'

/**
 * The BCP 47 tag react-aria keys its own strings by. `vite.config.ts` reads
 * this to bundle exactly these, so it imports nothing through `@/`.
 */
export const REGIONAL_LOCALES = {
  en: 'en-US',
  fr: 'fr-FR'
} as const satisfies Record<Locale, string>
