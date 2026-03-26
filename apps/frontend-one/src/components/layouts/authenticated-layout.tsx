import { Toaster } from '@repo/ui';
import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { Header } from '@/components/common/header';
import { Sidebar } from '@/components/common/sidebar';

export function AuthenticatedLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen md:h-screen w-full">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <main className="flex flex-1 flex-col md:overflow-y-auto">
        <Header collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <Outlet />
        <Toaster />
      </main>
    </div>
  );
}
