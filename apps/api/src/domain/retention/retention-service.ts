import type { Result } from '@adrienlcp/result'

import type { DeletedRows, RetentionStore } from './retention-store'
import { retentionCutoffAt } from './retention-window'

export const purgeExpiredRows = ({
  now,
  retention
}: {
  now: Temporal.Instant
  retention: RetentionStore
}): Promise<Result<DeletedRows, 'storage_unavailable'>> =>
  retention.deleteExpired(retentionCutoffAt(now))
