import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ListFilter,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { useState } from 'react';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  className?: string;
  clearFilterLabel?: string;
  emptyLabel?: string;
}

function ColumnFilterPopover<TData>({ column, clearFilterLabel }: { column: Column<TData>; clearFilterLabel: string }) {

  const uniqueValues = Array.from(column.getFacetedUniqueValues().keys()).sort();
  const filterValue = (column.getFilterValue() as string) ?? '';

  function select(value: string) {
    column.setFilterValue(filterValue === value ? undefined : value);
  }

  const isActive = !!filterValue;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'ml-1 rounded p-0.5 transition-colors hover:bg-surface',
            isActive && 'text-brand',
          )}
        >
          <ListFilter className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-2">
        <div className="flex flex-col gap-1">
          {uniqueValues.map((value) => (
            <button
              key={String(value)}
              type="button"
              className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-surface"
              onClick={() => select(String(value))}
            >
              <Checkbox
                checked={filterValue === String(value)}
                onCheckedChange={() => select(String(value))}
              />
              <span>{String(value)}</span>
            </button>
          ))}
          {filterValue.length > 0 && (
            <button
              type="button"
              onClick={() => column.setFilterValue(undefined)}
              className="mt-1 border-t pt-1 text-left text-xs text-subtle-text hover:text-page-text"
            >
              {clearFilterLabel}
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  className,
  clearFilterLabel = 'Limpar filtro',
  emptyLabel = 'Nenhum dado encontrado',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    filterFns: {
      multiSelect: (row, columnId, filterValue: string) =>
        String(row.getValue(columnId)) === filterValue,
    },
  });

  const totalPages = table.getPageCount();
  const currentPage = pagination.pageIndex + 1;

  return (
    <div
      className={cn(
        'flex flex-col gap-8 self-stretch rounded-xl border border-border bg-page-bg px-4 py-8',
        className,
      )}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                const canSort = header.column.getCanSort();
                const canFilter = header.column.getCanFilter();
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                          className={cn(
                            'flex items-center gap-1',
                            canSort && 'cursor-pointer hover:text-page-text',
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            sorted === 'asc' ? (
                              <SortAsc className="h-3.5 w-3.5" />
                            ) : sorted === 'desc' ? (
                              <SortDesc className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                            )
                          )}
                        </button>
                        {canFilter && (
                          <ColumnFilterPopover column={header.column} clearFilterLabel={clearFilterLabel} />
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-subtle-text"
              >
                {emptyLabel}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex w-full items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-subtle-text">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
