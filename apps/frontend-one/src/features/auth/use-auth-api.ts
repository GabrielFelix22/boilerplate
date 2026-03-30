import { toast } from '@repo/ui';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { instanceWithoutInterceptors } from '@/api/axios';
import { useAuthStore } from '@/stores/auth.store';
import type {
  ForgotPasswordPayload,
  ILoginRequest,
  ILoginResponse,
  ResetPasswordPayload,
} from './auth.types';
import { mockLogin } from './mock-login';

const ENDPOINT = '/auth';

const isMockAuth = import.meta.env.VITE_MOCK_AUTH === 'true';

async function login(credentials: ILoginRequest): Promise<ILoginResponse> {
  if (isMockAuth) return mockLogin(credentials);
  const { data } = await instanceWithoutInterceptors.post<ILoginResponse>(
    '/auth/login',
    credentials,
  );
  return data;
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  await instanceWithoutInterceptors
    .post(`${ENDPOINT}/forgot-password`, payload)
    .catch(() => {});
}

export async function resetPassword(payload: ResetPasswordPayload) {
  await instanceWithoutInterceptors.put(`${ENDPOINT}/reset-password`, {
    new_password: payload.newPassword,
    check_password: payload.checkPassword,
  });
}

export function useLoginMutation() {
  const { setSession } = useAuthStore();
  const router = useRouter();
  return useMutation({
    mutationFn: login,
    onSuccess: (data, variables) => {
      setSession({ ...data, remember: variables.remember });
      const search = router.state.location.search as { redirect?: string };
      router.navigate({ to: search?.redirect ?? '/' });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast(
        'Se este e-mail estiver em nosso sistema, você receberá um link para redefinir sua senha em instantes',
      );
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      useAuthStore.getState().clear();
      toast.success('Senha redefinida com sucesso', {
        description: 'Você já pode fazer login com sua nova senha.',
      });
      navigate({ to: '/login' });
    },
  });
}
