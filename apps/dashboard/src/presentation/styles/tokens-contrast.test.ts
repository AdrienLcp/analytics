import { readFileSync } from 'node:fs'

import { findContrastFailures, WCAG_AA } from '@adrienlcp/styles/contrast'
import { describe, expect, it } from 'vitest'

const TOKENS = readFileSync(new URL('_tokens.sass', import.meta.url), 'utf8')

const SURFACES = ['--ground', '--edge-warm', '--edge-green'] as const
const TEXT_INKS = ['--ink', '--ink-2', '--ink-3'] as const
const MARKS = [
  '--ink-3',
  '--page-views',
  '--visits',
  '--sequence-1',
  '--sequence-2',
  '--sequence-3'
] as const

describe('colour tokens', () => {
  it('[contrast] every ink and mark reads on every surface, in both themes', () => {
    expect(
      findContrastFailures(TOKENS, [
        ...SURFACES.flatMap((background) => [
          ...TEXT_INKS.map((foreground) => ({
            background,
            foreground,
            minimum: WCAG_AA.text
          })),
          ...MARKS.map((foreground) => ({
            background,
            foreground,
            minimum: WCAG_AA.nonText
          }))
        ]),
        { background: '--ink', foreground: '--on-ink', minimum: WCAG_AA.text },
        {
          background: '--seal',
          foreground: '--seal-ink',
          minimum: WCAG_AA.text
        }
      ])
    ).toEqual([])
  })
})
