/** Most-preferred first, as BCP 47 tags: `['fr-FR', 'fr', 'en-US']`. */
export const preferredLocales = (): readonly string[] => navigator.languages

export const prefersReducedMotion = (): boolean =>
  matchMedia('(prefers-reduced-motion: reduce)').matches

/** The address as typed, for a page that has to name it back. */
export const currentPath = (): string => location.pathname

/** Where this page is served from, which also serves the API and the tracker. */
export const currentOrigin = (): string => location.origin
