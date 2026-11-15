const UUID_BYTE_COUNT = 16
const VERSION_BYTE_INDEX = 6
const VARIANT_BYTE_INDEX = 8
const GROUP_ENDS = [8, 12, 16, 20, 32]

const stampVersionAndVariant = (byte: number, index: number): number => {
  if (index === VERSION_BYTE_INDEX) return (byte & 0x0f) | 0x40
  if (index === VARIANT_BYTE_INDEX) return (byte & 0x3f) | 0x80
  return byte
}

const toHex = (byte: number): string => byte.toString(16).padStart(2, '0')

/**
 * A version 4 UUID from `crypto.getRandomValues`, which every browser has had
 * for a decade: `crypto.randomUUID` only arrived in Chromium 92 and Safari
 * 15.4, and old Smart TVs run older.
 */
export const randomUuid = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(UUID_BYTE_COUNT))
  const hex = Array.from(bytes, (byte, index) =>
    toHex(stampVersionAndVariant(byte, index))
  ).join('')

  return GROUP_ENDS.map((end, group) =>
    hex.slice(GROUP_ENDS[group - 1] ?? 0, end)
  ).join('-')
}
