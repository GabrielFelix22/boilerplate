import type { Column, Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import * as React from "react"
import { DataTableDateFilter } from "./data-table-date-filter"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableSliderFilter } from "./data-table-slider-filter"
import { DataTableViewOptions } from "./data-table-view-options"
import { Button } from "../button"
import { Input } from "../input"
import { cn } from "../../lib/utils"

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
    children,
    className,
    ...props
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    const columns = React.useMemo(
        () => table.getAllColumns().filter((column) => column.getCanFilter()),
        [table],
    )

    const onReset = React.useCallback(() => {
        table.resetColumnFilters()
    }, [table])

    return (
        <div
            role="toolbar"
            aria-orientation="horizontal"
            className={cn(
                "flex w-full items-start justify-between gap-2 p-1",
                className,
            )}
            {...props}
        >
            <div className="flex flex-1 flex-wrap items-center gap-2">
                {columns.map((column) => (
                    <DataTableToolbarFilter key={column.id} column={column} />
                ))}
                {isFiltered && (
                    <Button
                        aria-label="Reset filters"
                        variant="outline"
                        size="sm"
                        className="border-dashed"
                        onClick={onReset}
                    >
                        <X />
                        Reset
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-2">
                {children}
                <DataTableViewOptions table={table} align="end" />
            </div>
        </div>
    )
}
interface DataTableToolbarFilterProps<TData> {
    column: Column<TData>
}

function DataTableToolbarFilter<TData>({
    column,
}: DataTableToolbarFilterProps<TData>) {
    {
        const columnMeta = column.columnDef.meta

        // Local input state so typing is instant; URL filter updates are debounced
        const currentValue = column.getFilterValue() as string | undefined
        const [localValue, setLocalValue] = React.useState<string>(currentValue ?? "")

        // Keep local in sync when external changes (URL/reset)
        React.useEffect(() => {
            setLocalValue(currentValue ?? "")
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [currentValue])

        // Debounce applying the filter to the table/URL
        const debounceRef = React.useRef<number | undefined>(undefined)
        React.useEffect(() => {
            if (debounceRef.current) window.clearTimeout(debounceRef.current)
            debounceRef.current = window.setTimeout(
                () => {
                    column.setFilterValue(localValue)
                },
                300,
            ) as unknown as number
            return () => {
                if (debounceRef.current) window.clearTimeout(debounceRef.current)
            }
        }, [localValue, column])

        const commitImmediate = (val: string) => {
            if (debounceRef.current) window.clearTimeout(debounceRef.current)
            column.setFilterValue(val)
        }

        const renderFilter = () => {
            if (!columnMeta?.variant) return null

            switch (columnMeta.variant) {
                case "text":
                    return (
                        <Input
                            placeholder={columnMeta.placeholder ?? columnMeta.label}
                            value={localValue}
                            onChange={(event) => setLocalValue(event.target.value)}
                            onBlur={(event) => {
                                // commit immediately on blur
                                commitImmediate(event.target.value)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value
                                    commitImmediate(val)
                                }
                            }}
                            className="h-8 w-40 lg:w-56"
                        />
                    )

                case "number":
                    return (
                        <div className="relative">
                            <Input
                                type="number"
                                inputMode="numeric"
                                placeholder={columnMeta.placeholder ?? columnMeta.label}
                                value={localValue}
                                onChange={(event) => setLocalValue(event.target.value)}
                                onBlur={(event) => commitImmediate(event.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const val = (e.target as HTMLInputElement).value
                                        commitImmediate(val)
                                    }
                                }}
                                className={cn("h-8 w-[120px]", columnMeta.unit && "pr-8")}
                            />
                            {columnMeta.unit && (
                                <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                                    {columnMeta.unit}
                                </span>
                            )}
                        </div>
                    )

                case "range":
                    return (
                        <DataTableSliderFilter
                            column={column}
                            title={columnMeta.label ?? column.id}
                        />
                    )

                case "date":
                case "dateRange":
                    return (
                        <DataTableDateFilter
                            column={column}
                            title={columnMeta.label ?? column.id}
                            multiple={columnMeta.variant === "dateRange"}
                        />
                    )

                case "select":
                case "multiSelect":
                    return (
                        <DataTableFacetedFilter
                            column={column}
                            title={columnMeta.label ?? column.id}
                            options={columnMeta.options ?? []}
                            multiple={columnMeta.variant === "multiSelect"}
                        />
                    )

                default:
                    return null
            }
        }

        return renderFilter()
    }
}
