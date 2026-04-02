import { createFileRoute } from '@tanstack/react-router';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) ?? '',
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();

  return (
    <div className="flex h-dvh items-center justify-center bg-login-gradient">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Redefinir senha</h1>
          <p className="text-sm text-login-text">
            Crie uma nova senha para sua conta
          </p>
        </div>
        <div className="rounded-lg border bg-card-bg p-6 shadow-sm">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
}
