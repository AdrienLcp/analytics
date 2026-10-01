import type { DotPath, PlainKey, Translator } from '@adrienlcp/i18n'

import type { EN_DICTIONARY } from './dictionary-en'

export type TranslationKey = DotPath<typeof EN_DICTIONARY>

/** A key whose message takes no value, so whoever reads it back can render it. */
export type PlainTranslationKey = PlainKey<typeof EN_DICTIONARY>

export type Translate = Translator<typeof EN_DICTIONARY>
