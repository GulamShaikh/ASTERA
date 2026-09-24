export type SpecRow = { id: string; label: string; value: string }

/** Blank labels are dropped — an empty editor row is just an unused slot. */
export function specRowsToObject(rows: SpecRow[]): Record<string, string> {
  const result: Record<string, string> = {}
  for (const row of rows) {
    const label = row.label.trim()
    if (label === '') continue
    result[label] = row.value.trim()
  }
  return result
}

export function objectToSpecRows(source: Record<string, string>): SpecRow[] {
  return Object.entries(source).map(([label, value], index) => ({ id: `spec-${index}-${label}`, label, value }))
}
