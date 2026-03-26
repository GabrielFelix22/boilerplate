import { z } from 'zod'


export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Informe o usuário'),
  password: z.string().min(1, 'Informe a senha'),
  remember: z.boolean().default(false),
})
export type LoginInput = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.email('E-mail inválido').trim().min(1, 'Informe um email'),
})
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>