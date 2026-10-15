import { toIsoString, toUtcDay } from '@/infrastructure/dates'

/**
 * How long a page view and a day of Web Vitals are kept. The CNIL exempts
 * audience measurement from consent only when the data it collects is kept
 * no longer than 25 months (deliberation 2020-091 and its audience
 * measurement guidance); anything older is deleted.
 */
export const RETENTION_MONTHS = 25

export type RetentionCutoff = {
  /** ISO 8601 instant: a page view viewed before it has expired. */
  before: string
  /** `YYYY-MM-DD`, in UTC: a day of Web Vitals before it has expired. */
  beforeDay: string
}

/** The oldest moment still kept, `RETENTION_MONTHS` calendar months before `now`, in UTC. */
export const retentionCutoffAt = (now: Temporal.Instant): RetentionCutoff => {
  const cutoff = now
    .toZonedDateTimeISO('UTC')
    .subtract({ months: RETENTION_MONTHS })
    .toInstant()

  return { before: toIsoString(cutoff), beforeDay: toUtcDay(cutoff) }
}
