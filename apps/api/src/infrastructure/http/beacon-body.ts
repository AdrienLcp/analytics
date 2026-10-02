/** Far above any real beacon: a larger body is refused before it is read. */
export const MAX_BEACON_BYTES = 4096

/** A beacon body is plain text: anything that is not JSON reads as `null` and fails the schema. */
export const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}
