import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, TextField } from '@repo/ui';
import { useForm, } from 'react-hook-form';
import { ForgotPasswordDialog } from '@/features/login/components/forgot-password-dialog';
import { type LoginInput, loginSchema } from '../auth.schemas';
import { useLoginMutation } from '../use-auth-api';

export function LoginForm() {
  const { mutate: login, isPending } = useLoginMutation();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', remember: false },
    mode: 'onBlur',
  });

  const handleSubmit = (data: LoginInput) =>
    login({ ...data, remember: data.remember ?? false });

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-8 py-8"
      enableUnsavedWarning={false}
      preventSubmitIfPristine={false}
    >
      <TextField
        name="email"
        label="E-mail"
        type='email'
        autoComplete="email"
        placeholder='Digite seu e-mail'
        disabled={isPending}
      />
      {/* <TextField
        name="password"
        label="Senha"
        type="password"
        autoComplete="current-password"
        placeholder='Digite sua senha'
        disabled={isPending}
      /> */}
      {/* <ForgotYourPassword isPending={isPending} /> */}
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

function _ForgotYourPassword({ isPending }: { isPending: boolean }) {
  // const { register } = useFormContext<LoginInput>();
  return (
    <div className="flex items-center justify-end">
      {/* <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          disabled={isPending}
          {...register('remember')}
        />
        <Label htmlFor="remember" className="font-normal cursor-pointer">
          Manter conectado
        </Label>
      </div> */}
      <ForgotPasswordDialog />
    </div>
  );
}
