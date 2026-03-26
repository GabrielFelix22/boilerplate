export type Solicitacao = {
  numero: string;
  contrato: string;
  item: string;
  status: string;
};

export const solicitacoes: Solicitacao[] = [
  {
    numero: 'SOL-2026-001',
    contrato: '#123 - Serviço A',
    item: 'Item C - Manutenção',
    status: 'Medição reprovada',
  },
  {
    numero: 'SOL-2026-002',
    contrato: '#124 - Serviço B',
    item: 'Item A - Instalação',
    status: 'Em medição',
  },
  {
    numero: 'SOL-2026-003',
    contrato: '#125 - Serviço C',
    item: 'Item B - Consultoria',
    status: 'Medição aprovada',
  },
  {
    numero: 'SOL-2026-004',
    contrato: '#125 - Serviço C',
    item: 'Item B - Consultoria',
    status: 'Em medição',
  },
  {
    numero: 'SOL-2026-005',
    contrato: '#124 - Serviço B',
    item: 'Item A - Instalação',
    status: 'Em medição',
  },
  {
    numero: 'SOL-2026-006',
    contrato: '#123 - Serviço A',
    item: 'Item C - Manutenção',
    status: 'Em medição',
  },
  {
    numero: 'SOL-2026-007',
    contrato: '#125 - Serviço C',
    item: 'Item B - Consultoria',
    status: 'Em medição',
  },
  {
    numero: 'SOL-2026-008',
    contrato: '#124 - Serviço B',
    item: 'Item A - Instalação',
    status: 'Em medição',
  },
  {
    numero: 'SOL-2026-009',
    contrato: '#123 - Serviço A',
    item: 'Item C - Manutenção',
    status: 'Em medição',
  },
  {
    numero: 'SOL-2026-010',
    contrato: '#125 - Serviço C',
    item: 'Item B - Consultoria',
    status: 'Em medição',
  },
  {
    numero: 'SOL-2026-011',
    contrato: '#124 - Serviço B',
    item: 'Item A - Instalação',
    status: 'Em medição',
  },
  {
    numero: 'SOL-2026-012',
    contrato: '#123 - Serviço A',
    item: 'Item C - Manutenção',
    status: 'Em medição',
  },
];
