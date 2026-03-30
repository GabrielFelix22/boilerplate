import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import type * as React from "react";

import { DataTablePagination } from "./data-table-pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../table";
import { cn } from "../../lib/utils";
import { getCommonPinningStyles } from "./data-table-utils";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
    table: TanstackTable<TData>;
    actionBar?: React.ReactNode;
    loading?: boolean;
    loadingComponent?: React.ReactNode;
}

export function DataTable<TData>({
    table,
    actionBar,
    loading,
    loadingComponent,
    children,
    className,
    ...props
}: DataTableProps<TData>) {
    return (
        <div
            className={cn("flex w-full flex-1 min-h-0 flex-col gap-2.5", className)}
            {...props}
        >
            {children}
            <div className="flex-1 min-h-0 overflow-auto rounded-md border">
                <Table className="table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        style={{
                                            ...getCommonPinningStyles({ column: header.column }),
                                        }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            loadingComponent ? (
                                <TableRow>
                                    <TableCell colSpan={table.getAllColumns().length} className="p-0">
                                        {loadingComponent}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={table.getAllColumns().length}
                                        className="h-32 text-center text-muted-foreground"
                                    >
                                        Carregando...
                                    </TableCell>
                                </TableRow>
                            )
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                ...getCommonPinningStyles({ column: cell.column }),
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllColumns().length}
                                    className="h-24 text-center"
                                >
                                    Nenhum resultado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col gap-2.5">
                <DataTablePagination table={table} />
                {actionBar &&
                    table.getFilteredSelectedRowModel().rows.length > 0 &&
                    actionBar}
            </div>
        </div>
    );
}
