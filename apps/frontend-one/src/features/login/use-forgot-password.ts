import { useMutation } from '@tanstack/react-query';
import { instanceWithoutInterceptors } from '@/api/axios';
import type { ForgotPasswordInput } from './schema';

async function forgotPassword(data: ForgotPasswordInput): Promise<void> {
  await instanceWithoutInterceptors.post('/auth/forgot-password', data);
}

export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword });
}
