import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
} from '@repo/ui';
import { Link, useMatches, useRouterState } from '@tanstack/react-router';
import * as React from 'react';
import { SidebarTrigger, useSidebar } from '@/components/common/sidebar';

const SEGMENT_LABELS: Record<string, string> = {
  contratos: 'Meus Contratos',
  solicitacoes: 'Minhas Solicitações',
  documentacao: 'Documentação',
  perfil: 'Perfil',
  dashboard: 'Dashboard',
  nova: 'Nova Solicitação',
};

function toLabel(segment: string) {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  try {
    return decodeURIComponent(segment)
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return segment;
  }
}

export type AppBreadcrumbProps = {
  homeLabel?: string;
  closeSidebarOnClick?: boolean;
};

export function AppBreadcrumb({
  homeLabel = 'Início',
  closeSidebarOnClick = false,
}: AppBreadcrumbProps) {
  const { isMobile, setOpenMobile, setOpen } = useSidebar();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const matches = useMatches();

  const parts = pathname.split('/').filter((seg) => Boolean(seg) && seg !== 'dashboard');
  const crumbs = parts.map((seg, idx) => {
    const href = `/${parts.slice(0, idx + 1).join('/')}`;
    const isLast = idx === parts.length - 1;
    const prev = idx > 0 ? parts[idx - 1] : undefined;
    const isNumericId = /^\d+$/.test(seg);

    let label = toLabel(seg);
    if (isLast && prev === 'solicitacoes' && isNumericId) label = 'Detalhes';

    const match = matches.find((m) => m.pathname.replace(/\/$/, '') === href);
    const loaderLabel = (
      match?.loaderData as { breadcrumbLabel?: string } | undefined
    )?.breadcrumbLabel;
    if (loaderLabel) label = loaderLabel;

    return { label, href };
  });

  const closeSidebar = React.useCallback(() => {
    if (!closeSidebarOnClick) return;
    if (isMobile) setOpenMobile(false);
    else setOpen(false);
  }, [closeSidebarOnClick, isMobile, setOpen, setOpenMobile]);

  return (
    <div className="flex h-[57px] shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger aria-label="Alternar sidebar" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb onClick={closeSidebar}>
        <BreadcrumbList>
          <BreadcrumbItem>
            {crumbs.length === 0 ? (
              <BreadcrumbPage>{homeLabel}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to="/">{homeLabel}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {crumbs.length > 0 && <BreadcrumbSeparator />}
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <React.Fragment key={c.href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={c.href}>{c.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

export default AppBreadcrumb;