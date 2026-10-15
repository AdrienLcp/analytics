import { purgeExpiredRows } from '@/domain/retention/retention-service'
import { createRetentionStore } from '@/domain/retention/retention-store'
import { logger } from '@/infrastructure/logging/logger'

/**
 * The daily Cron Trigger of `wrangler.jsonc`: deletes every row older than the retention
 * window, measured from the time the run was scheduled for. A failed run
 * throws, so Cloudflare lists it as failed and the next day retries.
 */
export const runRetentionPurge: ExportedHandlerScheduledHandler<Env> = async (
  controller,
  env
) => {
  const purged = await purgeExpiredRows({
    now: Temporal.Instant.fromEpochMilliseconds(controller.scheduledTime),
    retention: createRetentionStore(env.DB)
  })
  if (purged.status === 'failure') throw new Error(purged.error)

  logger.info('Deleted expired rows', purged.data)
}
