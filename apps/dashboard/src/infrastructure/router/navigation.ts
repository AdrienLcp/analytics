import {
  generatePath,
  type PathParam,
  useLoaderData,
  useLocation,
  useMatch,
  useNavigation,
  useRevalidator,
  useRouteError
} from 'react-router'

import { type Audience, isAudience } from '@analytics/protocol/audiences'
import { isSiteId, SITE_IDS, type SiteId } from '@analytics/protocol/site-ids'
import {
  isStatsPeriod,
  type StatsPeriod
} from '@analytics/protocol/stats-periods'

export const paths = {
  root: '/',
  site: '/:site'
} as const

/** The period a link opens on when it names none. */
export const DEFAULT_PERIOD: StatsPeriod = '30d'

/** The traffic a link opens on when it names none: people's. */
export const DEFAULT_AUDIENCE: Audience = 'humans'

/** The first site listed is the one the bare address opens on. */
export const DEFAULT_SITE: SiteId = SITE_IDS[0]

const PERIOD_SEARCH_PARAM = 'period'
const AUDIENCE_SEARCH_PARAM = 'audience'

const pathFor = <TPath extends string>(
  path: TPath,
  params: Record<PathParam<TPath>, string>
): string => generatePath<string>(path, params)

/**
 * A plate's address: the site in the path, the period and the traffic in the
 * query, so a link opens on the same figures. Defaults are left out to keep it
 * short.
 */
export const sitePathFor = ({
  audience = DEFAULT_AUDIENCE,
  period = DEFAULT_PERIOD,
  site
}: {
  audience?: Audience
  period?: StatsPeriod
  site: SiteId
}): string => {
  const path = pathFor(paths.site, { site })
  const search = new URLSearchParams()

  if (period !== DEFAULT_PERIOD) search.set(PERIOD_SEARCH_PARAM, period)
  if (audience !== DEFAULT_AUDIENCE) search.set(AUDIENCE_SEARCH_PARAM, audience)

  return search.size === 0 ? path : `${path}?${search}`
}

/** An unknown or missing period reads as the default rather than as an error. */
export const periodInSearch = (search: URLSearchParams): StatsPeriod => {
  const period = search.get(PERIOD_SEARCH_PARAM)

  return isStatsPeriod(period) ? period : DEFAULT_PERIOD
}

/** An unknown or missing traffic reads as people's rather than as an error. */
export const audienceInSearch = (search: URLSearchParams): Audience => {
  const audience = search.get(AUDIENCE_SEARCH_PARAM)

  return isAudience(audience) ? audience : DEFAULT_AUDIENCE
}

/** The period the address names, for chrome drawn outside the page. */
export const useLocationPeriod = (): StatsPeriod =>
  periodInSearch(new URLSearchParams(useLocation().search))

/** The traffic the address names, for chrome drawn outside the page. */
export const useLocationAudience = (): Audience =>
  audienceInSearch(new URLSearchParams(useLocation().search))

/** The site the address names, for chrome drawn outside the page. */
export const useLocationSite = (): SiteId | null => {
  const site = useMatch(paths.site)?.params.site

  return site !== undefined && isSiteId(site) ? site : null
}

/** The one `useLoaderData`: a feature pairs it with its own loader's type. */
export const useRouteData = <TLoader extends (...args: never[]) => unknown>() =>
  useLoaderData<TLoader>()

/** True while the next figures are on their way and the current ones still show. */
export const useIsRouteLoading = (): boolean =>
  useNavigation().state === 'loading'

/** Asks the current page's loader again — the way out of a failed read. */
export const useRetryRouteData = (): (() => void) => {
  const revalidator = useRevalidator()

  return () => {
    void revalidator.revalidate()
  }
}

/** Whatever the root boundary caught, flattened to one line for the console. */
export const useRouteFailure = (): string => {
  const error = useRouteError()

  return error instanceof Error ? error.message : String(error)
}
