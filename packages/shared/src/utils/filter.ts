/**
 * Filter builder for the backend's compact query filter format.
 *
 * Format: `filter=col<op>val,col<op>val,...`
 *
 * Operators:
 *   =    equal
 *   !=   not equal
 *   >    greater than
 *   >=   greater or equal
 *   <    less than
 *   <=   less or equal
 *   ~=   prefix match (LIKE 'val%')
 *   |    IN (col|a|b|c)
 *
 * Usage:
 *   buildFilter({ name: prefix('my'), service_id: eq('abc') })
 *   // => "name~=my,service_id=abc"
 *
 *   request.get('/services', { params: { filter: buildFilter({ name: prefix('test') }), size: 20 } })
 */

type FilterValue = string | undefined | null

interface FilterEntry {
  column: string
  op: string
  value: string
}

function entry(op: string, value: FilterValue): FilterEntry | null {
  if (value === undefined || value === null || value === '') return null
  return { column: '', op, value }
}

export function eq(value: FilterValue) { return entry('=', value) }
export function neq(value: FilterValue) { return entry('!=', value) }
export function gt(value: FilterValue) { return entry('>', value) }
export function gte(value: FilterValue) { return entry('>=', value) }
export function lt(value: FilterValue) { return entry('<', value) }
export function lte(value: FilterValue) { return entry('<=', value) }
export function prefix(value: FilterValue) { return entry('~=', value) }

export function oneOf(values: string[]): FilterEntry | null {
  const filtered = values.filter(Boolean)
  if (filtered.length === 0) return null
  return { column: '', op: '|', value: filtered.join('|') }
}

export type FilterSpec = Record<string, FilterEntry | FilterValue | null>

/**
 * Build a filter query string from a spec object.
 *
 * Each key is a column name. Values can be:
 *   - A FilterEntry from helper functions: `{ name: prefix('my') }`
 *   - A plain string (defaults to eq): `{ service_id: 'abc' }`
 *   - undefined/null/'' (skipped)
 *
 * Returns undefined when no conditions are present, so it can be
 * spread directly into params without adding an empty filter key.
 */
export function buildFilter(spec: FilterSpec): string | undefined {
  const parts: string[] = []

  for (const [col, raw] of Object.entries(spec)) {
    if (raw === undefined || raw === null || raw === '') continue

    if (typeof raw === 'string') {
      parts.push(`${col}=${raw}`)
      continue
    }

    if (raw.value === undefined || raw.value === null || raw.value === '') continue

    if (raw.op === '|') {
      parts.push(`${col}|${raw.value}`)
    } else {
      parts.push(`${col}${raw.op}${raw.value}`)
    }
  }

  return parts.length > 0 ? parts.join(',') : undefined
}

/**
 * Build list query params with optional filter + cursor pagination.
 */
export function listParams(
  filter?: FilterSpec,
  pagination?: { token?: string; size?: number },
): Record<string, string | number | undefined> {
  return {
    filter: filter ? buildFilter(filter) : undefined,
    token: pagination?.token,
    size: pagination?.size,
  }
}
