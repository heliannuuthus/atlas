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
 */

const RESERVED_CHARS = /[,|]/

type FilterValue = string | undefined | null

export type FilterOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | '~=' | '|'

export interface FilterOp {
  readonly op: FilterOperator
  readonly value: string
}

function op(operator: FilterOperator, value: FilterValue): FilterOp | null {
  if (value === undefined || value === null || value === '') return null
  if (RESERVED_CHARS.test(value)) {
    throw new Error(`Filter value must not contain reserved characters (, |): "${value}"`)
  }
  return { op: operator, value }
}

export function eq(value: FilterValue) { return op('=', value) }
export function neq(value: FilterValue) { return op('!=', value) }
export function gt(value: FilterValue) { return op('>', value) }
export function gte(value: FilterValue) { return op('>=', value) }
export function lt(value: FilterValue) { return op('<', value) }
export function lte(value: FilterValue) { return op('<=', value) }
export function prefix(value: FilterValue) { return op('~=', value) }

export function oneOf(values: string[]): FilterOp | null {
  const filtered = values.filter(Boolean)
  if (filtered.length === 0) return null
  for (const v of filtered) {
    if (RESERVED_CHARS.test(v)) {
      throw new Error(`Filter IN value must not contain reserved characters (, |): "${v}"`)
    }
  }
  return { op: '|', value: filtered.join('|') }
}

export type FilterSpec = Record<string, FilterOp | FilterValue | null>

export interface ListParams {
  filter?: string
  token?: string
  size?: number
}

/**
 * Build a filter query string from a spec object.
 *
 * Each key is a column name. Values can be:
 *   - A FilterOp from helper functions: `{ name: prefix('my') }`
 *   - A plain string (defaults to eq): `{ service_id: 'abc' }`
 *   - undefined/null/'' (skipped)
 *
 * Returns undefined when no conditions are present.
 */
export function buildFilter(spec: FilterSpec): string | undefined {
  const parts: string[] = []

  for (const [col, raw] of Object.entries(spec)) {
    if (raw === undefined || raw === null || raw === '') continue

    if (typeof raw === 'string') {
      if (RESERVED_CHARS.test(raw)) {
        throw new Error(`Filter value must not contain reserved characters (, |): "${raw}"`)
      }
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
): ListParams {
  return {
    filter: filter ? buildFilter(filter) : undefined,
    token: pagination?.token,
    size: pagination?.size,
  }
}
