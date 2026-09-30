/** Cloudflare's codes for "unknown" and "Tor exit node", which name no country. */
const NOT_A_COUNTRY = new Set(['XX', 'T1'])

export const countryFromCode = (code: string | null): string | null =>
  code === null || NOT_A_COUNTRY.has(code) ? null : code
