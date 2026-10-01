import type { Tally } from '@analytics/protocol/site-stats'

export type BreakdownRow =
  | { count: number; isOther: false; key: string; share: number }
  | { count: number; isOther: true; share: number }

const shareOf = ({ count, total }: { count: number; total: number }): number =>
  total === 0 ? 0 : count / total

/**
 * The listed tallies, then one row for whatever they leave out of `total` —
 * keys past the API's top ten, and page views that carried no value at all,
 * such as a direct visit's missing referrer. The rows always add up to the
 * total: nothing is dropped, only grouped.
 */
export const toBreakdownRows = ({
  tallies,
  total
}: {
  tallies: readonly Tally[]
  total: number
}): BreakdownRow[] => {
  const listed = tallies.reduce((sum, tally) => sum + tally.count, 0)
  const rest = total - listed
  const rows: BreakdownRow[] = tallies.map((tally) => ({
    count: tally.count,
    isOther: false,
    key: tally.key,
    share: shareOf({ count: tally.count, total })
  }))

  return rest > 0
    ? [
        ...rows,
        { count: rest, isOther: true, share: shareOf({ count: rest, total }) }
      ]
    : rows
}
