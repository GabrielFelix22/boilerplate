import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth/components/login-form';
import { useAuthStore } from '@/stores/auth.store';
export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) throw redirect({ to: '/' });
  },
  component: LoginPage,
});
function LoginPage() {
  return (
    <div className="flex h-dvh items-center justify-center bg-page-bg">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Acesso ao sistema
          </h1>
          <p className="text-sm text-subtle-text">
            Informe suas credenciais para continuar
          </p>
        </div>
        <div className="rounded-lg border bg-card-bg p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
