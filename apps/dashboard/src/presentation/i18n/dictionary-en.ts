import { defineDictionary, defineTranslation } from '@adrienlcp/i18n'

const UTC = 'UTC'

/**
 * The reference dictionary: its keys are the type every other locale is
 * checked against. Every date here is a UTC bucket, so every date format pins
 * `timeZone: 'UTC'` — a reader west of Greenwich would otherwise see each day
 * labelled with the one before.
 */
export const EN_DICTIONARY = defineDictionary({
  breakdowns: {
    countries: 'Countries',
    country: defineTranslation('{code:displayname}', {
      displayname: { code: { type: 'region' } }
    }),
    devices: 'Devices',
    language: defineTranslation('{code:displayname}', {
      displayname: { code: { type: 'language' } }
    }),
    lede: 'Each list adds up to its total. What falls outside the listed rows is grouped, never dropped.',
    locales: 'Languages',
    ofPageViews: defineTranslation('{count:plural}', {
      plural: { count: { one: 'of {?} page view', other: 'of {?} page views' } }
    }),
    ofVisits: defineTranslation('{count:plural}', {
      plural: { count: { one: 'of {?} visit', other: 'of {?} visits' } }
    }),
    other: {
      countries: 'Other or unknown',
      devices: 'Other',
      locales: 'Other or unknown',
      pages: 'Other pages',
      referrers: 'Direct or other sites',
      themes: 'Other'
    },
    pages: 'Top pages',
    referrers: 'Referrers',
    share: defineTranslation('{value:number}', {
      number: {
        value: {
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
          style: 'percent'
        }
      }
    }),
    themes: 'Themes',
    title: defineTranslation('{count:plural}', {
      plural: {
        count: {
          one: 'Where the one page view came from',
          other: 'Where the {?} page views came from'
        }
      }
    })
  },
  chart: {
    dayTick: defineTranslation('{day:date}', {
      date: { day: { day: 'numeric', month: 'short', timeZone: UTC } }
    }),
    endPageViews: 'page views',
    endVisits: 'visits',
    monthTick: defineTranslation('{month:date}', {
      date: { month: { month: 'short', timeZone: UTC } }
    }),
    summary: defineTranslation(
      'Chart of page views and visits {per:enum}, {range}. {pageViews:plural} and {visits:plural} in total. Use the left and right arrow keys to read each {unit:enum}.',
      {
        enum: {
          per: { day: 'per day', month: 'per month' },
          unit: { day: 'day', month: 'month' }
        },
        plural: {
          pageViews: { one: '{?} page view', other: '{?} page views' },
          visits: { one: '{?} visit', other: '{?} visits' }
        }
      }
    ),
    tick: '{value:number}',
    valueText: defineTranslation(
      '{bucket}: {pageViews:plural}, {visits:plural}',
      {
        plural: {
          pageViews: { one: '{?} page view', other: '{?} page views' },
          visits: { one: '{?} visit', other: '{?} visits' }
        }
      }
    ),
    weekdayTick: defineTranslation('{day:date}', {
      date: { day: { day: 'numeric', timeZone: UTC, weekday: 'short' } }
    })
  },
  colophon: {
    definition:
      '<b>A visit is a page view that arrives from outside the site.</b> Moving between pages of the same site adds page views, not visits. Nothing on this page could tell two visitors apart, so there is no consent banner: there is nothing to consent to.',
    never: {
      cookie: 'Cookies',
      cookieNote: 'No cookie is set, and nothing marks the browser.',
      fingerprint: 'Hash or fingerprint',
      fingerprintNote: 'No identifier is derived from anything.',
      ip: 'IP address',
      ipNote: 'Not stored, not logged.',
      query: 'Query string',
      queryNote: 'Never sent: the tracker reads the path alone.',
      referrer: 'Full referrer URL',
      referrerNote: 'Only its host survives.',
      title: 'Never recorded',
      userAgent: 'User agent',
      userAgentNote: 'Read once to turn crawlers away, never kept.'
    },
    recorded: {
      country: 'Country',
      countryNote:
        'Resolved at the network edge; the address it came from is dropped.',
      device: 'Device class',
      deviceNote: 'Read from the window width: mobile, tablet or desktop.',
      language: 'Browser language',
      languageNote: 'fr-FR, en-US, de…',
      path: 'Page path',
      pathNote: 'Without its query string.',
      referrer: 'Referrer host',
      referrerNote: 'linkedin.com, never the full link.',
      speed: 'Page speed',
      speedNote:
        'Three timings per page view, sent on their own once the page is left, added to a running count per day and never kept per visit.',
      theme: 'Theme',
      themeNote: 'Light or dark.',
      title: 'Recorded with each page view'
    },
    title: 'What is counted, and what never is'
  },
  controls: {
    label: 'Dashboard controls',
    language: 'Language',
    period: 'Period',
    site: 'Site'
  },
  credits: {
    busiest: defineTranslation('{unit:enum}', {
      enum: { unit: { day: 'Busiest day', month: 'Busiest month' } }
    }),
    busiestDay: defineTranslation('{day:date}', {
      date: { day: { day: 'numeric', month: 'short', timeZone: UTC } }
    }),
    busiestMonth: defineTranslation('{month:date}', {
      date: { month: { month: 'short', timeZone: UTC, year: 'numeric' } }
    }),
    busiestNote: defineTranslation('{count:plural}', {
      plural: { count: { one: '{?} page view', other: '{?} page views' } }
    }),
    count: '{value:number}',
    label: 'Totals',
    needsPageView: 'Needs a first page view',
    needsVisit: 'Needs a first visit',
    noneYet: 'None recorded yet',
    notAvailable: 'Not available',
    pagesPerVisit: 'Pages per visit',
    pagesPerVisitNote: 'Page views ÷ visits',
    pagesPerVisitValue: defineTranslation('{value:number}', {
      number: {
        value: { maximumFractionDigits: 1, minimumFractionDigits: 1 }
      }
    }),
    pageViews: 'Page views',
    pageViewsNote: 'Every page opened',
    visits: 'Visits',
    visitsNote: 'Arrivals from outside the site'
  },
  empty: {
    bodyDays: defineTranslation('{count:plural}', {
      plural: {
        count: {
          one: 'Once the tracker is on {site}, each page view lands here within a minute: one line for page views, one for visits. The lists below fill in at the same time.',
          other:
            'Once the tracker is on {site}, each page view lands here within a minute: one line for page views, one for visits, {?} days across. The lists below fill in at the same time.'
        }
      }
    }),
    bodyMonths: defineTranslation('{count:plural}', {
      plural: {
        count: {
          one: 'Once the tracker is on {site}, each page view lands here within a minute: one bar for page views, one for visits. The lists below fill in at the same time.',
          other:
            'Once the tracker is on {site}, each page view lands here within a minute: one bar for page views, one for visits, {?} months across. The lists below fill in at the same time.'
        }
      }
    }),
    breakdownsLede:
      'Each one will add up to its total, with the rest grouped as other. None of them can single out a visitor.',
    breakdownsTitle: 'What these lists will show',
    lede: 'Nothing has been measured on <b>{site}</b> over {span}. Until the tracker runs there, every figure below is an honest zero.',
    pending: {
      countries: 'Resolved at the edge; no address is kept.',
      locales: 'The language each browser asks for.',
      pages: 'The paths people open, without query strings.',
      referrers: 'The sites visits arrive from, by host only.',
      themesAndDevices: 'Light or dark; mobile, tablet or desktop.'
    },
    recorded: '0 recorded',
    snippetLabel: 'The whole install, one tag',
    themesAndDevices: 'Themes and devices',
    title: 'This plate is still blank',
    waiting: 'Waiting for the first page view'
  },
  error: {
    body: defineTranslation('{reason:enum}', {
      enum: {
        reason: {
          invalid_response:
            'The API answered, but not in the shape this page reads. Reloading picks up the latest version of both.',
          unavailable:
            'The API answered, but could not read its database just now. The page views are still being counted.',
          unreachable:
            'The API could not be reached. The page views are still being counted; only this page failed to read them.'
        }
      }
    }),
    retry: 'Try again',
    screen: {
      description:
        'Something failed while drawing the dashboard. Reloading usually fixes it.',
      reload: 'Reload',
      title: 'This page broke'
    },
    title: defineTranslation('{reason:enum}', {
      enum: {
        reason: {
          invalid_response: 'The figures came back unreadable',
          unavailable: 'The figures are not ready',
          unreachable: 'The figures did not arrive'
        }
      }
    })
  },
  footer: {
    hosting: 'Counted on a Cloudflare Worker, kept in D1',
    utc: 'Days and months in UTC'
  },
  head: {
    bucketing: defineTranslation('{unit:enum}', {
      enum: { unit: { day: 'Daily totals, UTC', month: 'Monthly totals, UTC' } }
    }),
    lede: 'Page views and visits on <b>{site}</b> over {span}. Nobody is identified: no cookie, no IP address and no user agent is ever stored.'
  },
  loading: {
    body: 'Reading the figures for {site}.',
    title: 'Setting the plate'
  },
  masthead: {
    name: 'Analytics',
    owner: "Adrien Lacourpaille's sites",
    skip: 'Skip to the figures',
    source: 'Source code, AGPL'
  },
  notFound: {
    back: 'Open the {site} plate',
    body: '{path} is not a page of this dashboard.',
    title: 'No plate at this address'
  },
  period: {
    long: defineTranslation('{period:enum}', {
      enum: {
        period: { '7d': '7 days', '12m': '12 months', '30d': '30 days' }
      }
    }),
    short: defineTranslation('{period:enum}', {
      enum: { period: { '7d': '7D', '12m': '12M', '30d': '30D' } }
    }),
    span: defineTranslation('{period:enum}', {
      enum: {
        period: {
          '7d': 'the last 7 days',
          '12m': 'the last 12 months',
          '30d': 'the last 30 days'
        }
      }
    })
  },
  plate: {
    stamp: 'no cookie · no personal data · no cookie · no personal data · ',
    title: defineTranslation('{unit:enum}', {
      enum: {
        unit: {
          day: 'Page views and visits, per day',
          month: 'Page views and visits, per month'
        }
      }
    })
  },
  range: {
    days: defineTranslation('{from:date} – {to:date}', {
      date: {
        from: { day: 'numeric', month: 'short', timeZone: UTC },
        to: { day: 'numeric', month: 'short', timeZone: UTC, year: 'numeric' }
      }
    }),
    months: defineTranslation('{from:date} – {to:date}', {
      date: {
        from: { month: 'short', timeZone: UTC, year: 'numeric' },
        to: { month: 'short', timeZone: UTC, year: 'numeric' }
      }
    })
  },
  speed: {
    abbr: defineTranslation('{metric:enum}', {
      enum: { metric: { cls: 'CLS', inp: 'INP', lcp: 'LCP' } }
    }),
    label: 'Page speed',
    lede: 'Measured by the visitors’ own browsers when they left a page, and read at the value three page loads in four stay under.',
    ledeEmpty:
      'Browsers report these timings when a visitor leaves a page. None has for this site in the period yet.',
    name: defineTranslation('{metric:enum}', {
      enum: {
        metric: {
          cls: 'Layout shift',
          inp: 'Response to input',
          lcp: 'Largest paint'
        }
      }
    }),
    note: defineTranslation(
      '{question}, for three page loads in four. From <b>{samples:plural}</b>.',
      {
        plural: {
          samples: { one: '{?} page load', other: '{?} page loads' }
        }
      }
    ),
    noteEmpty: '{question}. No browser has reported it yet.',
    question: defineTranslation('{metric:enum}', {
      enum: {
        metric: {
          cls: 'How much the page jumped while it loaded',
          inp: 'How long a tap or click waited for the page to answer',
          lcp: 'How long until the main content showed'
        }
      }
    }),
    tick: {
      cls: '{value:number}',
      inp: '{value:number} ms',
      lcp: '{value:number} s'
    },
    title: 'How fast it felt',
    value: {
      cls: defineTranslation('{value:number}', {
        number: {
          value: { maximumFractionDigits: 2, minimumFractionDigits: 2 }
        }
      }),
      inp: defineTranslation('{value:number} ms', {
        number: { value: { maximumFractionDigits: 0 } }
      }),
      lcp: defineTranslation('{value:number} s', {
        number: {
          value: { maximumFractionDigits: 1, minimumFractionDigits: 1 }
        }
      })
    },
    verdict: defineTranslation('{rating:enum}', {
      enum: {
        rating: {
          good: 'Good',
          'needs-improvement': 'Needs improvement',
          poor: 'Poor'
        }
      }
    }),
    verdictEmpty: 'Not measured yet'
  },
  table: {
    caption: 'Page views and visits, {range}',
    day: defineTranslation('{day:date}', {
      date: {
        day: {
          day: 'numeric',
          month: 'short',
          timeZone: UTC,
          weekday: 'short',
          year: 'numeric'
        }
      }
    }),
    month: defineTranslation('{month:date}', {
      date: { month: { month: 'long', timeZone: UTC, year: 'numeric' } }
    }),
    toggle: 'View as a table',
    unit: defineTranslation('{unit:enum}', {
      enum: { unit: { day: 'Day', month: 'Month' } }
    })
  },
  values: {
    device: defineTranslation('{device:enum}', {
      enum: {
        device: { desktop: 'Desktop', mobile: 'Mobile', tablet: 'Tablet' }
      }
    }),
    theme: defineTranslation('{theme:enum}', {
      enum: { theme: { dark: 'Dark', light: 'Light' } }
    })
  }
})
