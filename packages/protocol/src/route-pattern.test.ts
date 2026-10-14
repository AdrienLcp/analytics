import { describe, expect, it } from 'vitest'

import { routeOfPath, UNKNOWN_ROUTE } from './route-pattern'

const routes = [
  '/',
  '/:locale',
  '/:locale/:game',
  '/:locale/credits',
  '/wall',
  '/wall/:roomCode'
] as const

describe('routeOfPath', () => {
  it('[route] keeps a literal path as it is', () => {
    expect(routeOfPath({ path: '/', routes })).toBe('/')
    expect(routeOfPath({ path: '/wall', routes })).toBe('/wall')
  })

  it('[route] names the parameters instead of their values', () => {
    expect(routeOfPath({ path: '/wall/K7PD', routes })).toBe('/wall/:roomCode')
  })

  it('[route] prefers the route with more literal segments, whatever the order', () => {
    expect(routeOfPath({ path: '/fr/credits', routes })).toBe(
      '/:locale/credits'
    )
    expect(routeOfPath({ path: '/fr/blind-test', routes })).toBe(
      '/:locale/:game'
    )
  })

  it('[route] reads a trailing slash as the same route', () => {
    expect(routeOfPath({ path: '/wall/K7PD/', routes })).toBe('/wall/:roomCode')
  })

  it('[route] hides a path no route matches', () => {
    expect(routeOfPath({ path: '/fr/blind-test/K7PD', routes })).toBe(
      UNKNOWN_ROUTE
    )
    expect(routeOfPath({ path: '/anything', routes: [] })).toBe(UNKNOWN_ROUTE)
  })

  it('[route] gives a route back unchanged', () => {
    for (const route of routes) {
      expect(routeOfPath({ path: route, routes })).toBe(route)
    }
  })
})
