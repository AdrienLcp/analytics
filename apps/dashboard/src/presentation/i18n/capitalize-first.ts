/**
 * The text with its first character in capitals, the way `locale` writes it.
 * `Intl` names a language lowercase where the language itself does
 * ("français (France)"), which reads wrong at the head of a list row.
 */
export const capitalizeFirst = ({
  locale,
  text
}: {
  locale: string
  text: string
}): string => {
  const [first] = new Intl.Segmenter(locale, {
    granularity: 'grapheme'
  }).segment(text)
  if (first === undefined) return text

  return `${first.segment.toLocaleUpperCase(locale)}${text.slice(first.segment.length)}`
}
