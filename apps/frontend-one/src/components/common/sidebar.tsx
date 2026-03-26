import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui';
import { Link, useRouter, useRouterState } from '@tanstack/react-router';
import {
  BookOpen,
  ClipboardPen,
  FilePlus,
  Inbox,
  LayoutDashboard,
  LogOut,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import version from '../../../package.json';
import Logo from '../../assets/Logo.svg';
import LogoIcon from '../../assets/logo-prefeitura.png';

const menuItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Meus Contratos', to: '/contratos', icon: ClipboardPen },
  { label: 'Minhas Solicitações', to: '/solicitacoes', icon: Inbox },
  { label: 'Documentação', to: '/documentacao', icon: BookOpen },
  { label: 'Nova Solicitação', to: '/solicitacoes/nova', icon: FilePlus },
];

const accountItems = [{ label: 'Perfil', to: '/perfil', icon: User }];

const itemClass = (collapsed: boolean) =>
  cn(
    'flex h-9 items-center gap-3 rounded-md text-sm transition-colors',
    collapsed ? 'w-9 justify-center mx-auto' : 'w-full px-3',
  );

const labelClass = (collapsed: boolean) =>
  cn(
    'overflow-hidden whitespace-nowrap transition-[opacity,max-width]',
    collapsed
      ? 'max-w-0 opacity-0 duration-150'
      : 'max-w-xs opacity-100 duration-200 delay-150',
  );

const sectionLabelClass = (collapsed: boolean) =>
  cn(
    'mb-1 px-3 text-xs font-medium uppercase tracking-wider text-subtle-text transition-[opacity,height] duration-300 overflow-hidden',
    collapsed ? 'opacity-0 h-0' : 'opacity-100 h-5',
  );

function NavIcon({
  Icon,
  collapsed,
}: {
  Icon: React.ElementType;
  collapsed: boolean;
}) {
  return (
    <Icon
      className={cn(
        'size-4 shrink-0',
        collapsed && 'flex items-center justify-center ml-2',
      )}
    />
  );
}

function WithTooltip({
  label,
  collapsed,
  children,
}: {
  label: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  if (!collapsed) return <>{children}</>;
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function NavItem({
  label,
  to,
  icon: Icon,
  collapsed,
  alwaysShowIcon = false,
}: {
  label: string;
  to: string;
  icon: React.ElementType;
  collapsed: boolean;
  alwaysShowIcon?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = pathname === to;

  return (
    <WithTooltip label={label} collapsed={collapsed}>
      <div className={collapsed ? 'w-full' : undefined}>
        <Link
          to={to}
          className={cn(
            itemClass(collapsed),
            isActive
              ? 'bg-hover-bg text-hover-text font-medium'
              : 'text-subtle-text hover:bg-hover-bg hover:text-hover-text',
          )}
        >
          {(collapsed || alwaysShowIcon) && (
            <NavIcon Icon={Icon} collapsed={collapsed} />
          )}
          <span className={labelClass(collapsed)}>{label}</span>
        </Link>
      </div>
    </WithTooltip>
  );
}

function NavButton({
  label,
  icon: Icon,
  onClick,
  collapsed,
  className,
}: {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  collapsed: boolean;
  className?: string;
}) {
  return (
    <WithTooltip label={label} collapsed={collapsed}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          itemClass(collapsed),
          'cursor-pointer text-subtle-text hover:bg-hover-bg hover:text-hover-text w-full',
          className,
        )}
      >
        <NavIcon Icon={Icon} collapsed={collapsed} />
        <span className={labelClass(collapsed)}>{label}</span>
      </button>
    </WithTooltip>
  );
}

export function Sidebar({
  collapsed,
  onToggle: _onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { logout } = useAuthStore();
  const router = useRouter();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'flex h-dvh shrink-0 flex-col border-r bg-page-bg overflow-hidden transition-[width] duration-300 ease-in-out',
          collapsed ? 'w-14 items-center' : 'w-56',
        )}
      >
        <div className="flex h-[57px] shrink-0 items-center justify-center overflow-hidden">
          <img
            src={collapsed ? LogoIcon : Logo}
            alt="Logo"
            className={cn(
              'w-auto transition-all duration-300',
              collapsed ? 'h-8' : 'h-12',
            )}
          />
        </div>

        <nav
          className={cn(
            'flex flex-1 flex-col overflow-y-auto overflow-x-hidden w-full pt-30 pb-2',
            collapsed ? 'px-0' : 'px-2',
          )}
        >
          <span className={sectionLabelClass(collapsed)}>Menu</span>
          <div className="flex flex-col gap-0.5">
            {menuItems.map((item) => (
              <NavItem key={item.to} {...item} collapsed={collapsed} />
            ))}
          </div>
        </nav>

        <div
          className={cn(
            'border-t w-full py-2 flex flex-col gap-0.5',
            collapsed ? 'px-0' : 'px-2',
          )}
        >
          <div className="flex justify-between items-center">
            <span className={sectionLabelClass(collapsed)}>Conta</span>
            <span
              className={cn(
                'px-2 text-xs mb-1.5 text-subtle-text/60 transition-[opacity,height] duration-300 overflow-hidden',
                collapsed ? 'opacity-0 h-0' : 'opacity-100 h-5',
              )}
            >
              Versão {version.version}
            </span>
          </div>
          {accountItems.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              collapsed={collapsed}
              alwaysShowIcon
            />
          ))}
          <NavButton
            label="Sair"
            icon={LogOut}
            collapsed={collapsed}
            className="hover:text-danger"
            onClick={() => {
              logout('manual');
              router.navigate({ to: '/login' });
            }}
          />
        </div>
      </aside>
    </TooltipProvider>
  );
}
