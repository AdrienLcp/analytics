import { z } from 'zod'

import { SITE_IDS } from './site-ids'

export const siteIdSchema = z.enum(SITE_IDS)
