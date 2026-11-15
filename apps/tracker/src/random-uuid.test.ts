import { afterEach, describe, expect, it, vi } from 'vitest'

import { viewKeySchema } from '@analytics/protocol/page-view'

import { randomUuid } from './random-uuid'

const VERSION_4_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('randomUuid', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('[view-key] draws a version 4 UUID the collector accepts', () => {
    const uuid = randomUuid()

    expect(uuid).toMatch(VERSION_4_UUID)
    expect(viewKeySchema.safeParse(uuid).success).toBe(true)
  })

  it('[view-key] stamps the version and variant over any random bytes', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: (bytes: Uint8Array) => bytes.fill(0xff)
    })

    expect(randomUuid()).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff')
  })

  it('[view-key] needs no crypto.randomUUID, which browsers before Chromium 92 lack', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: crypto.getRandomValues.bind(crypto)
    })

    expect(randomUuid()).toMatch(VERSION_4_UUID)
  })

  it('[view-key] draws a different one each time', () => {
    const uuids = new Set(Array.from({ length: 100 }, randomUuid))

    expect(uuids.size).toBe(100)
  })
})
