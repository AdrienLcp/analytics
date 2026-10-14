import { type RoutePattern, routeOfPath } from './route-pattern'
import type { SiteId } from './site-ids'

/**
 * Every route each site's router declares, copied from its `navigation.ts`. A
 * page is counted under its route, never under its path: the paths carry
 * event ids, umpire codes, room and pairing codes that let anyone holding
 * them in, and the dashboard showing them is public. A route a site adds
 * before it is listed here is counted as `UNKNOWN_ROUTE` until it is.
 */
export const SITE_ROUTES = {
  'on-record': [
    '/',
    '/deputes',
    '/deputes/:deputyId',
    '/groupes',
    '/groupes/:groupId',
    '/legal',
    '/methode',
    '/mon-depute',
    '/qui-vote-comme-vous',
    '/scrutins',
    '/scrutins/:scrutinNumber',
    '/senat/scrutins',
    '/senat/scrutins/:scrutinId',
    '/senateurs',
    '/senateurs/:senatorId'
  ],
  portfolio: [
    '/',
    '/:locale',
    '/:locale/about',
    '/:locale/contact',
    '/:locale/cv',
    '/:locale/cv/plain',
    '/:locale/legal',
    '/:locale/projects/:slug'
  ],
  scoreboard: [
    '/',
    '/legal',
    '/e/:eventId',
    '/e/:eventId/display',
    '/e/:eventId/display/:displayId',
    '/e/:eventId/organiser',
    '/e/:eventId/umpire',
    '/e/:eventId/umpire/:umpireCode'
  ],
  taverla: [
    '/',
    '/:locale',
    '/:locale/:game',
    '/:locale/credits',
    '/host/:roomCode',
    '/invite/:roomCode',
    '/pair/:pairingCode',
    '/play/:roomCode',
    '/wall',
    '/wall/:roomCode'
  ]
} as const satisfies Record<SiteId, readonly RoutePattern[]>

export const routeOfSitePath = ({
  path,
  site
}: {
  path: string
  site: SiteId
}): RoutePattern => routeOfPath({ path, routes: SITE_ROUTES[site] })
