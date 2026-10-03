/**
 * Always with its millisecond fraction, as `Date#toISOString` writes it:
 * `Instant#toString()` drops a zero fraction, and stored text would stop
 * sorting and comparing as one format.
 */
export const toIsoString = (instant: Temporal.Instant): string =>
  instant.toString({ smallestUnit: 'millisecond' })

/** The `YYYY-MM-DD` day an instant falls on, in UTC. */
export const toUtcDay = (instant: Temporal.Instant): string =>
  instant.toZonedDateTimeISO('UTC').toPlainDate().toString()
