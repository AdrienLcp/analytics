import type { Result } from '@adrienlcp/result'

/** A failed `Result` the app falls back from, so the fallback is never silent. */
export const warnOnFailure = <T, E>(
  outcome: Result<T, E>,
  what: string
): void => {
  if (outcome.status === 'failure') console.warn(what, outcome.error)
}

/** What the root boundary caught, for whoever opens the console. */
export const reportRenderFailure = (failure: string): void => {
  console.error(
    'The dashboard hit an error it could not render through',
    failure
  )
}
