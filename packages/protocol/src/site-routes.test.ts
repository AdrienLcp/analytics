import { describe, expect, it } from 'vitest'

import { SITE_IDS } from './site-ids'
import { routeOfSitePath, SITE_ROUTES } from './site-routes'

describe('routeOfSitePath', () => {
  it('[site routes] never keeps a scoreboard event id or umpire code', () => {
    expect(
      routeOfSitePath({ path: '/e/3f9a1c/umpire/481516', site: 'scoreboard' })
    ).toBe('/e/:eventId/umpire/:umpireCode')
    expect(
      routeOfSitePath({ path: '/e/3f9a1c/organiser', site: 'scoreboard' })
    ).toBe('/e/:eventId/organiser')
  })

  it('[site routes] never keeps a taverla room or pairing code', () => {
    expect(routeOfSitePath({ path: '/play/K7PD', site: 'taverla' })).toBe(
      '/play/:roomCode'
    )
    expect(routeOfSitePath({ path: '/pair/482913', site: 'taverla' })).toBe(
      '/pair/:pairingCode'
    )
    expect(routeOfSitePath({ path: '/en/credits', site: 'taverla' })).toBe(
      '/:locale/credits'
    )
  })

  it('[site routes] names an on-record or portfolio entity by its parameter', () => {
    expect(routeOfSitePath({ path: '/deputes/PA6', site: 'on-record' })).toBe(
      '/deputes/:deputyId'
    )
    expect(
      routeOfSitePath({ path: '/en/projects/scoreboard', site: 'portfolio' })
    ).toBe('/:locale/projects/:slug')
  })

  it('[site routes] lists no route twice for a site', () => {
    for (const site of SITE_IDS) {
      const routes = SITE_ROUTES[site]
      expect(new Set(routes).size, site).toBe(routes.length)
    }
  })
})
