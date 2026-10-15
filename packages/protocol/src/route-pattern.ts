/**
 * A route as a site's router declares it: literal segments and `:name`
 * parameters, `/e/:eventId/umpire/:umpireCode`.
 */
export type RoutePattern = `/${string}`

/**
 * What a path no route matches is counted as — a 404, a typo, a route the
 * table does not list yet. Never the path itself: an unknown path can carry a
 * code as easily as a known one.
 */
export const UNKNOWN_ROUTE = '/*'

const segmentsOf = (path: string): string[] =>
  path.split('/').filter((segment) => segment !== '')

const isParameter = (segment: string): boolean => segment.startsWith(':')

const literalSegmentCount = (segments: readonly string[]): number =>
  segments.filter((segment) => !isParameter(segment)).length

const matchesSegments = ({
  pathSegments,
  routeSegments
}: {
  pathSegments: readonly string[]
  routeSegments: readonly string[]
}): boolean =>
  routeSegments.length === pathSegments.length &&
  routeSegments.every(
    (segment, index) => isParameter(segment) || segment === pathSegments[index]
  )

/**
 * The route a path was opened on, its parameters left as their names, so an
 * id or an access code in the path is never sent or stored. The route with the
 * most literal segments wins, as in React Router: `/fr/credits` is
 * `/:locale/credits`, not `/:locale/:game`. A route passed back in comes out
 * unchanged.
 */
export const routeOfPath = ({
  path,
  routes
}: {
  path: string
  routes: readonly RoutePattern[]
}): RoutePattern => {
  const pathSegments = segmentsOf(path)
  let bestRoute: RoutePattern = UNKNOWN_ROUTE
  let bestLiteralCount = -1

  for (const route of routes) {
    const routeSegments = segmentsOf(route)
    const literalCount = literalSegmentCount(routeSegments)

    if (
      literalCount > bestLiteralCount &&
      matchesSegments({ pathSegments, routeSegments })
    ) {
      bestRoute = route
      bestLiteralCount = literalCount
    }
  }

  return bestRoute
}
