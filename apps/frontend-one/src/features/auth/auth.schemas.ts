import { isStrongPassword } from '@repo/utils';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido').trim().min(1, 'Informe o e-mail'),
  // password: z.string().min(1, 'Informe a senha'),
  remember: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email('Informe um e-mail válido').trim().min(1, 'Informe o e-mail'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .refine((v) => isStrongPassword(v), {
    message:
      'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais',
  });

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    checkPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((data) => data.newPassword === data.checkPassword, {
    message: 'As senhas não coincidem',
    path: ['checkPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

