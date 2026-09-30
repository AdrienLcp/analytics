const BOT_USER_AGENT =
  /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|pingdom|uptime|monitor/i

/** Read on arrival to drop the page view, then thrown away with the request. */
export const isBotUserAgent = (userAgent: string | null): boolean =>
  userAgent === null || BOT_USER_AGENT.test(userAgent)
