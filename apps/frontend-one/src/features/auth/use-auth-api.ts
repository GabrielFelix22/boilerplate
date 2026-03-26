import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { instanceWithoutInterceptors } from '@/api/axios';
import { useAuthStore } from '@/stores/auth.store';
import type { ILoginRequest, ILoginResponse } from './auth.types';
import { mockLogin } from './mock-login';

const isMockAuth = import.meta.env.VITE_MOCK_AUTH === 'true';

async function login(credentials: ILoginRequest): Promise<ILoginResponse> {
  if (isMockAuth) return mockLogin(credentials);
  const { data } = await instanceWithoutInterceptors.post<ILoginResponse>(
    '/auth/login',
    credentials,
  );
  return data;
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
