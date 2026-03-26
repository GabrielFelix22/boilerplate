import {
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui';
import type { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical } from 'lucide-react';
import { type Solicitacao, solicitacoes } from '../mock-solicitacoes';

const columns: ColumnDef<Solicitacao>[] = [
  { accessorKey: 'numero', header: 'Número' },
  { accessorKey: 'contrato', header: 'Contrato' },
  { accessorKey: 'item', header: 'Item' },
  { accessorKey: 'status', header: 'Status' },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-subtle-text hover:bg-hover-bg hover:text-hover-text">
          <EllipsisVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => console.log('Ver', row.original)}>
            Ver
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function DashboardTable() {
  return (
    <DataTable
      columns={columns}
      data={solicitacoes}
      pageSize={10}
      className="w-full"
    />
  );
}
