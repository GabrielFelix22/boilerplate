import { z } from 'zod'
import { dataTableConfig } from './data-table-config'
import type {
    ExtendedColumnSort,
    ExtendedColumnFilter,
    FilterOperator,
    FilterVariant,
    Option,
} from './types'
import type { ColumnDef } from '@tanstack/react-table'
import { getDefaultFilterOperator } from './data-table-utils'
import { generateId } from '@repo/utils'

const sortingItemSchema = z.object({
    id: z.string(),
    desc: z.boolean()
})

export const parseSorting = <TData>(
    value?: unknown,
    columnIds?: string[] | Set<string>
): ExtendedColumnSort<TData>[] => {
    if (!value) return []

    const validKeys = columnIds
        ? columnIds instanceof Set
            ? columnIds
            : new Set(columnIds)
        : null

    try {
        const parsed =
            typeof value === 'string'
                ? JSON.parse(value)
                : value

        const result = z.array(sortingItemSchema).safeParse(parsed)
        if (!result.success) return []

        if (validKeys && result.data.some(item => !validKeys.has(item.id)))
            return []

        return result.data as ExtendedColumnSort<TData>[]
    } catch {
        return []
    }
}

export const serializeSorting = <TData>(
    value?: ExtendedColumnSort<TData>[]
): string | undefined => {
    if (!value || !value.length) return undefined
    return JSON.stringify(value)
}

const filterItemSchema = z.object({
    id: z.string(),
    // Support strings and numbers (single or array) for dates/ranges
    // and null for operators that don't require a value (isEmpty/isNotEmpty)
    value: z.union([
        z.string(),
        z.number(),
        z.array(z.string()),
        z.array(z.number()),
        z.array(z.union([z.string(), z.number(), z.null()])),
        z.null(),
    ]),
    variant: z.enum(dataTableConfig.filterVariants),
    operator: z.enum(dataTableConfig.operators),
    filterId: z.string()
})

export type FilterItemSchema = z.infer<typeof filterItemSchema>

export const serializeFilters = <TData>(
    value?: ExtendedColumnFilter<TData>[]
): string | undefined => {
    if (!value || !value.length) return undefined
    return JSON.stringify(value)
}

// ----------------------
// Compact (human-readable) filters helpers
// ----------------------

export type ColumnMetaLite = {
    variant?: FilterVariant
    options?: Option[]
}

export function buildColumnMetaById<TData>(
    columns: Array<ColumnDef<TData, unknown>>
): Map<string, ColumnMetaLite> {
    const map = new Map<string, ColumnMetaLite>()
    columns.forEach((c) => {
        if (c && (c.id || ('accessorKey' in c && c.accessorKey))) {
            const id = String(c.id ?? ('accessorKey' in c ? c.accessorKey : ''))
            map.set(id, (c.meta as ColumnMetaLite) ?? {})
        }
    })
    return map
}

export function parseCompactFiltersFromSearch<TData>(
    search: Record<string, unknown>,
    columnMetaById: Map<string, ColumnMetaLite>
): ExtendedColumnFilter<TData>[] {
    const filters: ExtendedColumnFilter<TData>[] = []
    for (const [id, meta] of columnMetaById.entries()) {
        const raw = search[id]
        const hasValue = !(raw === undefined || raw === null)
        const variant = (meta?.variant ?? 'text') as FilterVariant
        if (!hasValue && String(search[`${id}_op`] ?? '') === '') continue

        const opRaw = String(search[`${id}_op`] ?? '') as FilterOperator | ''
        const operator = (opRaw || getDefaultFilterOperator(variant)) as FilterOperator

        let value: string | string[] | null

        if (operator === 'isEmpty' || operator === 'isNotEmpty') {
            value = null
        } else if (Array.isArray(raw)) {
            value = raw.map((v) => String(v))
        } else {
            const rawStr = String(raw ?? '')
            if (variant === 'multiSelect') {
                value = rawStr ? rawStr.split(',').filter(Boolean) : []
            } else if (variant === 'range' || variant === 'dateRange' || operator === 'isBetween') {
                // Expect comma-separated for ranges
                value = rawStr ? rawStr.split(',').filter(Boolean) : []
            } else {
                value = rawStr
            }
        }

        filters.push({
            id: id as Extract<keyof TData, string>,
            value,
            variant,
            operator,
            filterId: generateId({ length: 8 }),
        })
    }
    return filters
}

export function compactFiltersToSearchParams<TData>(
    value?: ExtendedColumnFilter<TData>[]
): Record<string, unknown> {
    const out: Record<string, unknown> = {}
    if (!value || !value.length) return out

    for (const f of value) {
        const id = String(f.id)
        // Represent arrays as comma-separated strings for readability
        const v = Array.isArray(f.value)
            ? f.value.map((x) => String(x)).join(',')
            : f.value === null || f.value === undefined
                ? ''
                : String(f.value)
        out[id] = v
        out[`${id}_op`] = f.operator
    }
    return out
}
