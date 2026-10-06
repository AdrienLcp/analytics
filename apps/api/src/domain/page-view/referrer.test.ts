import { describe, expect, it } from 'vitest'

import { classifyReferrer } from './referrer'

const siteHosts = ['adrienlcp.com']

describe('classifyReferrer', () => {
  it('[referrer] starts a direct visit when there is no referrer', () => {
    expect(classifyReferrer({ referrer: null, siteHosts })).toEqual({
      isEntry: true,
      referrerHost: null
    })
  })

  it('[referrer] continues the visit from a page of the same site', () => {
    expect(
      classifyReferrer({
        referrer: 'https://adrienlcp.com/en/cv',
        siteHosts
      })
    ).toEqual({ isEntry: false, referrerHost: null })
  })

  it('[referrer] keeps the external host without www or path', () => {
    expect(
      classifyReferrer({
        referrer: 'https://www.google.com/search?q=adrien',
        siteHosts
      })
    ).toEqual({ isEntry: true, referrerHost: 'google.com' })
  })

  it('[referrer] treats an unparsable referrer as a direct visit', () => {
    expect(classifyReferrer({ referrer: 'not a url', siteHosts })).toEqual({
      isEntry: true,
      referrerHost: null
    })
  })
})
