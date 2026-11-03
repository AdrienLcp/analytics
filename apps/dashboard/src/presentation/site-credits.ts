import type { Locale } from '@/presentation/i18n/locales'

/** The author the footer credits, linked to his site in the reader's language. */
export const AUTHOR = {
  name: 'Adrien Lacourpaille',
  siteHref: {
    en: 'https://adrienlcp.com/en',
    fr: 'https://adrienlcp.com/fr'
  }
} as const satisfies { name: string; siteHref: Record<Locale, string> }

/**
 * The dashboard's public repository, linked from the masthead and the footer.
 * Never `null`: the AGPL owes every visitor the source.
 */
export const SOURCE_REPOSITORY_HREF = 'https://github.com/AdrienLcp/analytics'
