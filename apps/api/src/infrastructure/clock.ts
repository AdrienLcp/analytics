/** Read through `Date.now()`, which fake timers steer and `Temporal.Now` ignores. */
export const now = (): Temporal.Instant =>
  Temporal.Instant.fromEpochMilliseconds(Date.now())
