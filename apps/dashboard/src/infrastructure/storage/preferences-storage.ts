import type { Result } from '@adrienlcp/result'
import {
  readRecognizedText,
  type StorageReadError,
  type StorageWriteError,
  writeStoredText
} from '@adrienlcp/safe-storage'

import { isLocale, type Locale } from '@/presentation/i18n/locales'

const LOCALE_KEY = 'analytics:locale'

/**
 * Succeeds with `null` when no language was ever chosen on this device, which
 * is not the default: the caller then follows what the browser asks for.
 */
export const readStoredLocale = (): Result<Locale | null, StorageReadError> =>
  readRecognizedText({ isRecognized: isLocale, key: LOCALE_KEY })

export const writeStoredLocale = (
  locale: Locale
): Result<void, StorageWriteError> =>
  writeStoredText({ key: LOCALE_KEY, text: locale })
