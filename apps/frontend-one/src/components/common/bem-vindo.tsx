import { cn } from '@repo/ui';
import { DashboardTable } from '@/features/dashboard/components/dashboard-table';

interface WelcomeCardProps {
  name: string;
  className?: string;
}

export function BemVindo({ name, className }: WelcomeCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-start gap-4 w-full flex-1 p-6',
        className,
      )}
    >
      <div className="flex flex-col items-start gap-1.5 border-b w-full">
        <h2 className="text-lg font-semibold">Olá, {name}</h2>
        <p className="mt-1 text-sm text-subtle-text mb-4">Resumo e atalhos.</p>
      </div>
      <DashboardTable />
    </div>
  );
}
