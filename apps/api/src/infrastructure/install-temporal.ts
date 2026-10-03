/**
 * Workers ship no `Temporal` yet. Where the runtime has its own, nothing is
 * loaded; elsewhere the polyfill is installed before the app starts.
 */
if (!('Temporal' in globalThis)) {
  await import('temporal-polyfill/global')
}

export {}
