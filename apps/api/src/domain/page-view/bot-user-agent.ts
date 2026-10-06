import { isbot } from 'isbot'

/** Read on arrival to drop the page view, then thrown away with the request. */
export const isBotUserAgent = (userAgent: string | null): boolean =>
  !userAgent || isbot(userAgent)
