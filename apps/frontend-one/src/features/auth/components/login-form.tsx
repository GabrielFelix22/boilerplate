import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, Form, Label, TextField } from '@repo/ui';
import { useForm, useFormContext } from 'react-hook-form';
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

  const handleSubmit = (data: LoginInput) =>
    login({ ...data, remember: data.remember ?? false });

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      className="w-full max-w-sm"
      enableUnsavedWarning={false}
      preventSubmitIfPristine={false}
    >
      <TextField
        name="username"
        label="Usuário"
        autoComplete="username"
        disabled={isPending}
      />
      <TextField
        name="password"
        label="Senha"
        type="password"
        autoComplete="current-password"
        disabled={isPending}
      />
      <RememberField isPending={isPending} />
      <Button
        type="submit"
        disabled={isPending}
        className="w-full"
        variant="default"
      >
        {isPending ? 'Entrando...' : 'Entrar'}
      </Button>
    </Form>
  );
}

function RememberField({ isPending }: { isPending: boolean }) {
  const { register } = useFormContext<LoginInput>();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          disabled={isPending}
          {...register('remember')}
        />
        <Label htmlFor="remember" className="font-normal cursor-pointer">
          Manter conectado
        </Label>
      </div>
      <ForgotPasswordDialog />
    </div>
  );
}
