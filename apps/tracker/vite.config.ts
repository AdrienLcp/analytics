import { resolve } from 'node:path'

import { defineConfig } from 'vite'

import { TRACKER_FILE_NAME } from '@analytics/protocol/tracker-script'

/** The sites it loads on are opened on old Smart TVs, Chromium 87 among them. */
const OLDEST_BROWSERS = ['chrome87', 'safari14']

/**
 * Built straight into the API's static assets, next to the dashboard, which
 * builds first and empties the folder: the Worker serves the script from the
 * same origin that receives its beacons.
 */
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/tracker.ts'),
      fileName: () => TRACKER_FILE_NAME,
      formats: ['iife'],
      name: 'analyticsTracker'
    },
    outDir: resolve(import.meta.dirname, '../api/public'),
    target: OLDEST_BROWSERS
  }
})
