import { isOptedOut } from './opt-out'

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]'])

/** A local build, an automated browser or an opted-out owner is never counted. */
export const shouldTrack = (): boolean =>
  location.protocol === 'https:' &&
  !LOCAL_HOSTNAMES.has(location.hostname) &&
  !navigator.webdriver &&
  !isOptedOut()
