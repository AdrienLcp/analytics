import { isAutomated, isServedPublicly } from './browser'
import { isOptedOut } from './opt-out'

/** A local build, an automated browser or an opted-out owner is never counted. */
export const shouldTrack = (): boolean =>
  isServedPublicly() && !isAutomated() && !isOptedOut()
