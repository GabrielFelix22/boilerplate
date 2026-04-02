import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import {
  BookOpen,
  ClipboardPen,
  FilePlus,
  Inbox,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  User,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/common/sidebar';
import { useAuthStore } from '@/stores/auth.store';
import version from '../../../package.json';
import Logo from '../../assets/Logo.svg';
import LogoIcon from '../../assets/logo-prefeitura.png';

const LOGIN_ROUTE = '/login';

type NavLink = {
  label: string;
  to: string;
  icon: LucideIcon;
  exact?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Meus Contratos', to: '/contratos', icon: ClipboardPen },
  {
    label: 'Minhas Solicitações',
    to: '/solicitacoes',
    icon: Inbox,
    exact: true,
  },
  { label: 'Documentação', to: '/documentacao', icon: BookOpen },
  { label: 'Nova Solicitação', to: '/solicitacoes/nova', icon: FilePlus },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const name = user?.name ?? 'Usuário';
  const email = user?.email ?? '';

  const handleLogout = () => {
    logout('manual');
    navigate({ to: LOGIN_ROUTE });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-2">
        <Link
          to="/"
          className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-1"
        >
          <img
            src={LogoIcon}
            alt="Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>
        <SidebarMenuButton
          asChild
          tooltip="Página Inicial"
          className="h-10 group-data-[collapsible=icon]:hidden"
        >
          <Link to="/">
            <img src={Logo} alt="Logo" className="h-10 w-full object-contain" />
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="pt-50">
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_LINKS.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.to
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link to={item.to}>
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <div className="px-2 py-1.5 group-data-[collapsible=icon]:hidden w-full">
            <span className="text-xs text-muted-foreground">
              Versão {version.version}
            </span>
          </div>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="w-full justify-start gap-2 px-2 py-2 items-center"
                  tooltip={name}
                >
                  <User className="size-4" />
                  <div className="grid text-left group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium leading-tight truncate">
                      {name}
                    </span>
                    <span className="text-xs text-muted-foreground leading-tight truncate">
                      {email}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <Link to="/perfil">
                  <DropdownMenuItem>
                    <User className="mr-2 size-4" />
                    Ver perfil
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
