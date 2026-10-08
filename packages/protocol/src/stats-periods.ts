/**
 * The periods the stats cover. Kept apart from the schema, as the site ids
 * are, so the dashboard's first screen reads them without shipping Zod.
 */
export const STATS_PERIODS = ['7d', '30d', '12m'] as const

export type StatsPeriod = (typeof STATS_PERIODS)[number]

export const isStatsPeriod = (value: string | null): value is StatsPeriod =>
  STATS_PERIODS.some((period) => period === value)
