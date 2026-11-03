import { RETENTION_MONTHS } from '@analytics/protocol/retention'

import { toIsoString, toUtcDay } from '@/infrastructure/dates'

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
