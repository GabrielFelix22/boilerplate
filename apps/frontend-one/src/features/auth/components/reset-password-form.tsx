import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, TextField } from '@repo/ui';
import { useForm } from 'react-hook-form';
import { type ResetPasswordInput, resetPasswordSchema } from '../auth.schemas';
import { useResetPassword } from '../use-auth-api';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', checkPassword: '' },
    mode: 'onBlur',
  });

  const handleSubmit = (data: ResetPasswordInput) =>
    resetPassword({ ...data, token });

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      className="w-full max-w-sm"
      enableUnsavedWarning={false}
      preventSubmitIfPristine={false}
    >
      <TextField
        name="newPassword"
        label="Nova senha"
        type="password"
        autoComplete="new-password"
        placeholder="Digite sua nova senha"
        disabled={isPending}
      />
      <TextField
        name="checkPassword"
        label="Confirmar nova senha"
        type="password"
        autoComplete="new-password"
        placeholder="Confirme sua nova senha"
        disabled={isPending}
      />
      <Button
        type="submit"
        disabled={isPending}
        className="w-full mt-4"
        variant="default"
      >
        {isPending ? 'Redefinindo...' : 'Redefinir senha'}
      </Button>
    </Form>
  );
}
