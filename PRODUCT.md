# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: a visitor arriving from Adrien's portfolio project page — a recruiter
or a developer — who opens the public dashboard to judge the project. They must
understand within seconds what is measured, for which site, and that no visitor
is identified. Secondary: Adrien, reading how his own sites are doing.

## Product Purpose

Privacy-first, self-hosted analytics for Adrien's sites. A tiny tracker sends a
beacon per page view to a Cloudflare Worker backed by D1; a public dashboard
shows the aggregated figures. Success: the dashboard reads clearly to a
stranger and proves the privacy claim by what it shows — and by what it cannot
show.

## Positioning

Counts without identifying anyone: no cookie, no IP, no user agent, no hash,
no full referrer or query string. A visit is inferred from the referrer alone
(a page view arriving from outside the site starts one). No consent banner is
needed because there is nothing to consent to. The code is public (AGPL).

## Operating Context

- Opened from the portfolio, often on a phone, usually once.
- Sites tracked: portfolio, taverla, on-record (Séance is excluded on purpose).
- Periods: 7 days, 30 days, 12 months (daily or monthly buckets, UTC).
- Served same-origin by the Worker at https://analytics.adrienlcp.workers.dev.

## Capabilities and Constraints

- Metrics: page views, visits; breakdowns by page path, referrer host, country,
  locale, theme (light/dark), device class.
- API: `GET /api/sites/:site/stats?period=7d|30d|12m`, contract in
  `packages/protocol` (`siteStatsResponseSchema`).
- Locales: English (default) and French, through `@adrienlcp/i18n`.
- Stack: Vite + React, react-router (data mode), indented Sass — Adrien's
  toolkit conventions.

## Evidence on Hand

- Real data only. Production holds no page view yet; a site without data shows
  a real empty state explaining what will be measured. No synthetic or demo
  figures are ever shown as real.

## Product Principles

1. Privacy is the product: nothing on screen could tell two visitors apart.
2. Legible to a stranger first, efficient for the owner second.
3. Show the honest number, including zero.
4. Say what is not collected as plainly as what is.
