import { isAutomated, isServedPublicly } from './browser'
import { isOptedOut } from './opt-out'

/**
 * A local build, an automated browser, an opted-out owner or a visitor whose
 * browser sends Global Privacy Control is never counted.
 */
export const shouldTrack = (): boolean =>
  isServedPublicly() && !isAutomated() && !isOptedOut()
