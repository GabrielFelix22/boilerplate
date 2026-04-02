import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  TextField,
} from '@repo/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { type ForgotPasswordInput, forgotPasswordSchema } from '../schema';
import { useForgotPassword } from '../use-forgot-password';

export function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const { mutate, isPending } = useForgotPassword();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) form.reset();
  };

  const handleSubmit = (values: ForgotPasswordInput) => {
    mutate(values, { onSuccess: () => handleOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} >
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className="px-0 cursor-pointer"
          type="button"
        >
          Esqueceu a senha?
        </Button>
      </DialogTrigger>
      <DialogContent overlayClassName="bg-black/40 backdrop-blur-xs">
        <DialogHeader>
          <DialogTitle>Recuperar senha</DialogTitle>
          <DialogDescription>
            Informe o e-mail cadastrado para receber o link de redefinição de
            senha.
          </DialogDescription>
        </DialogHeader>
        <Form form={form} onSubmit={handleSubmit}>
          <TextField
            name="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            disabled={isPending}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Enviando...' : 'Enviar'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
