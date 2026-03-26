import { z } from 'zod'
export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Informe o usuário'),
  password: z.string().min(1, 'Informe a senha'),
  remember: z.boolean().default(false),
})
export type LoginInput = z.infer<typeof loginSchema>
