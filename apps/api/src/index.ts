import '@/infrastructure/install-temporal'

import { createApp } from '@/app'
import { runRetentionPurge } from '@/infrastructure/cron/retention-cron'

const app = createApp()

export default {
  fetch: app.fetch,
  scheduled: runRetentionPurge
} satisfies ExportedHandler<Env>
