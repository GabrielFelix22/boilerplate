import { cn } from '@repo/ui';
import { useRouterState } from '@tanstack/react-router';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const routeLabels: Record<string, string> = {
  '/': 'Início',
  '/contratos': 'Meus Contratos',
  '/solicitacoes': 'Minhas Solicitações',
  '/solicitacoes/nova': 'Nova Solicitação',
  '/documentacao': 'Documentação',
  '/perfil': 'Perfil',
};

export function Header({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const label = routeLabels[pathname] ?? '';

  return (
    <header className="flex h-[57px] shrink-0 items-center gap-3 border-b px-4">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-md text-subtle-text transition-colors hover:bg-hover-bg hover:text-hover-text',
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-4" />
        ) : (
          <PanelLeftClose className="size-4" />
        )}
      </button>

      <nav className="flex items-center gap-1.5 text-sm text-subtle-text">
        <a href="/" className="text-page-text hover:font-medium">
          Inicio
        </a>
        {label && label !== 'Início' && (
          <>
            <span>/</span>
            <span className="text-page-text">{label}</span>
          </>
        )}
      </nav>
    </header>
  );
}
