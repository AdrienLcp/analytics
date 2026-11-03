import type { Locale } from '@/presentation/i18n/locales'
import { AUTHOR } from '@/presentation/site-credits'

/** Who publishes the dashboard: a private individual, reached through his site's contact page. */
export const PUBLISHER = {
  contactHrefFor: {
    en: 'https://adrienlcp.com/en/contact',
    fr: 'https://adrienlcp.com/fr/contact'
  },
  name: AUTHOR.name
} as const satisfies {
  contactHrefFor: Record<Locale, string>
  name: string
}

/** The dashboard, its API and its database all run on Cloudflare Workers and D1. */
export const HOST = {
  addressLines: ['101 Townsend St', 'San Francisco, CA 94107', 'USA'],
  name: 'Cloudflare, Inc.'
} as const

/** How long Workers Logs keeps a line the Worker writes, on the free plan. */
export const LOG_RETENTION_DAYS = 3

export const CNIL_COMPLAINT_HREF = 'https://www.cnil.fr/fr/plaintes'
