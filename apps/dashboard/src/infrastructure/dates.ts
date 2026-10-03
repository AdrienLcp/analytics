/**
 * Midnight UTC at the start of a `YYYY-MM-DD` day, as the `Date` that
 * `Intl.DateTimeFormat` formats.
 */
export const startOfUtcDay = (isoDay: string): Date =>
  new Date(`${isoDay}T00:00:00Z`)
