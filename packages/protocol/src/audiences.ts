/**
 * Whose page views the stats count. A page view is a human's when the browser
 * did not declare itself automated and someone then touched, scrolled, typed
 * in or left the page; every other page view is a robot's. Kept apart from the
 * schema, as the periods are, so the dashboard's first screen reads them
 * without shipping Zod.
 */
export const AUDIENCES = ['humans', 'robots'] as const

export type Audience = (typeof AUDIENCES)[number]

export const isAudience = (value: string | null): value is Audience =>
  AUDIENCES.some((audience) => audience === value)
