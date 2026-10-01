import { Result } from '@adrienlcp/result'
import type { z } from 'zod'

import { API_ROUTES } from '@analytics/protocol/routes'
import type { SiteId } from '@analytics/protocol/site-ids'
import {
  type SiteStatsResponse,
  type StatsPeriod,
  type siteStatsQuerySchema,
  siteStatsResponseSchema
} from '@analytics/protocol/site-stats'

/**
 * - `aborted` — a newer request superseded this one; never shown.
 * - `unreachable` — no answer at all: offline, DNS, the Worker down.
 * - `unavailable` — an answer, but an error status.
 * - `invalid_response` — an answer the contract does not describe.
 */
export type SiteStatsError =
  | 'aborted'
  | 'invalid_response'
  | 'unavailable'
  | 'unreachable'

const siteStatsPathFor = ({
  period,
  site
}: {
  period: StatsPeriod
  site: SiteId
}): string => {
  const query = new URLSearchParams({
    period
  } satisfies z.input<typeof siteStatsQuerySchema>)

  return `${API_ROUTES.siteStats.replace(':site', encodeURIComponent(site))}?${query}`
}

const parseJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json()
  } catch {
    return null
  }
}

/** Validated against the schema the Worker builds its answer from. */
export const fetchSiteStats = async ({
  period,
  signal,
  site
}: {
  period: StatsPeriod
  signal: AbortSignal
  site: SiteId
}): Promise<Result<SiteStatsResponse, SiteStatsError>> => {
  let response: Response

  try {
    response = await fetch(siteStatsPathFor({ period, site }), { signal })
  } catch {
    return Result.failure(signal.aborted ? 'aborted' : 'unreachable')
  }

  if (!response.ok) return Result.failure('unavailable')

  const stats = siteStatsResponseSchema.safeParse(await parseJson(response))

  if (signal.aborted) return Result.failure('aborted')

  return stats.success
    ? Result.success(stats.data)
    : Result.failure('invalid_response')
}
