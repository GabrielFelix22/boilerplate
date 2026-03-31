import { Toaster } from '@repo/ui';
import { Outlet } from '@tanstack/react-router';
import { AppBreadcrumb } from '@/components/common/app-breadcrumb';
import { AppSidebar } from '@/components/common/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/common/sidebar';

export function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppBreadcrumb />
        <div className="flex flex-1 flex-col md:overflow-y-auto">
          <Outlet />
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
