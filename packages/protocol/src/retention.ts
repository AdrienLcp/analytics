/**
 * How long a page view and a day of Web Vitals are kept: the API purges
 * anything older, and the dashboard's legal page states the same figure. The
 * CNIL exempts audience measurement from consent only when the data it
 * collects is kept no longer than 25 months (deliberation 2020-091 and its
 * audience measurement guidance).
 */
export const RETENTION_MONTHS = 25
