import { isServedPublicly } from './browser'
import { isOptedOut } from './opt-out'

/**
 * A local build, an opted-out owner or a visitor whose browser sends Global
 * Privacy Control is never counted. An automated browser is, as a robot.
 */
export const shouldTrack = (): boolean => isServedPublicly() && !isOptedOut()
