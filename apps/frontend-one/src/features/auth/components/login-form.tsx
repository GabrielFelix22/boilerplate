import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@repo/ui';
import { useForm } from 'react-hook-form';
import { ForgotPasswordDialog } from '@/features/login/components/forgot-password-dialog';
import { type LoginInput, loginSchema } from '../auth.schemas';
import { useLoginMutation } from '../use-auth-api';

export function LoginForm() {
  const { mutate: login, isPending } = useLoginMutation();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '', remember: false },
    mode: 'onBlur',
  });

  const handleSubmit = (data: LoginInput) => login(data);

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      className="w-full max-w-sm"
      enableUnsavedWarning={false}
      preventSubmitIfPristine={false}
    >
      <Form.Input
        name="username"
        label="Usuário"
        autoComplete="username"
        disabled={isPending}
      />
      <Form.Input
        name="password"
        label="Senha"
        type="password"
        autoComplete="current-password"
        disabled={isPending}
      />
      <div className="flex items-center justify-between">
        <Form.Remember name="remember" disabled={isPending}>
          Manter conectado
        </Form.Remember>
        <ForgotPasswordDialog />
      </div>
      <Form.Submit
        loading={isPending}
        loadingText="Entrando..."
        className="w-full"
      >
        Entrar
      </Form.Submit>
    </Form>
  );
}
