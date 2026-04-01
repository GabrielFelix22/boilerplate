import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido').trim().min(1, 'Informe o e-mail'),
  password: z.string().min(1, 'Informe a senha'),
  remember: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
