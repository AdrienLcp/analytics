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

import { isSiteId, SITE_IDS, type SiteId } from '@analytics/protocol/site-ids'
import {
  type StatsPeriod,
  statsPeriodSchema
} from '@analytics/protocol/site-stats'

export const paths = {
  root: '/',
  site: '/:site'
} as const

/** The period a link opens on when it names none. */
export const DEFAULT_PERIOD: StatsPeriod = '30d'

/** The first site listed is the one the bare address opens on. */
export const DEFAULT_SITE: SiteId = SITE_IDS[0]

const PERIOD_SEARCH_PARAM = 'period'

const pathFor = <TPath extends string>(
  path: TPath,
  params: Record<PathParam<TPath>, string>
): string => generatePath<string>(path, params)

/**
 * A plate's address: the site in the path, the period in the query, so a link
 * opens on the same figures. The default period is left out to keep it short.
 */
export const sitePathFor = ({
  period = DEFAULT_PERIOD,
  site
}: {
  period?: StatsPeriod
  site: SiteId
}): string => {
  const path = pathFor(paths.site, { site })

  return period === DEFAULT_PERIOD
    ? path
    : `${path}?${new URLSearchParams({ [PERIOD_SEARCH_PARAM]: period })}`
}

/** An unknown or missing period reads as the default rather than as an error. */
export const periodInSearch = (search: URLSearchParams): StatsPeriod => {
  const period = statsPeriodSchema.safeParse(search.get(PERIOD_SEARCH_PARAM))

  return period.success ? period.data : DEFAULT_PERIOD
}

/** The period the address names, for chrome drawn outside the page. */
export const useLocationPeriod = (): StatsPeriod =>
  periodInSearch(new URLSearchParams(useLocation().search))

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
