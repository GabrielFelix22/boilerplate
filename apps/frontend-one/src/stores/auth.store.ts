import { toast } from '@repo/ui';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { queryClient } from '@/api/query-client';
import type { IAccount } from '@/features/auth/accounts.types';
import type { ILoginResponse } from '@/features/auth/auth.types';

type LogoutReason = 'manual' | 'expired' | 'idle';
type DecodedToken = {
  name?: string;
  email?: string;
  preferred_username?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
};
export type AuthState = {
  user: IAccount | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  refreshExpiresIn: number | null;
  sessionStartedAt: number | null;
  rememberMe: boolean;
  setSession: (p: Partial<ILoginResponse> & { remember?: boolean }) => void;
  setUser: (u: IAccount | null) => void;
  clear: () => void;
  getToken: () => string | null;
  logout: (reason?: LogoutReason) => void;
  isRefreshTokenExpired: () => boolean;
};
const getStorage = () =>
  typeof window === 'undefined'
    ? { getItem: () => null, setItem: () => { }, removeItem: () => { } }
    : {
      getItem: (n: string) =>
        localStorage.getItem(n) ?? sessionStorage.getItem(n),
      setItem: (n: string, v: string) => {
        sessionStorage.setItem(n, v);
        try {
          const p = JSON.parse(v) as { state?: { rememberMe?: boolean } };
          if (p?.state?.rememberMe) localStorage.setItem(n, v);
          else localStorage.removeItem(n);
        } catch {
          localStorage.removeItem(n);
        }
      },
      removeItem: (n: string) => {
        localStorage.removeItem(n);
        sessionStorage.removeItem(n);
      },
    };
const reset = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  rememberMe: false,
  refreshExpiresIn: null,
  sessionStartedAt: null,
};


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...reset,
      setSession: p => set(s => {
        const accessToken = p.access_token || null
        const refreshToken = p.refresh_token || null
        const refreshExpiresIn = p.refresh_expires_in || null
        let user: IAccount | null = null
        if (accessToken) {
          try {
            const d = jwtDecode<DecodedToken>(accessToken)
            const realmRoles = d.realm_access?.roles ?? []
            const clientRoles = Object.values(d.resource_access ?? {}).flatMap(c => c.roles ?? [])
            user = {
              id: d.preferred_username || '',
              name: d.name || '',
              email: d.email || '',
              roles: [...new Set([...realmRoles, ...clientRoles])],
            }
          } catch (e) { console.error('[Auth] decode failed:', e) }
        }
        return {
          accessToken, refreshToken, refreshExpiresIn, user,
          isAuthenticated: !!accessToken,
          rememberMe: p.remember ?? false,
          sessionStartedAt: refreshExpiresIn ? Date.now() : s.sessionStartedAt,
        }
      }),
      setUser: u => set(s => ({ user: u, isAuthenticated: s.isAuthenticated || !!u })),
      clear: () => { queryClient.clear(); set(reset) },
      getToken: () => get().accessToken,
      logout: (reason?: LogoutReason) => {
        queryClient.clear(); set(reset)
        if (reason === 'expired') toast.error('Sessão expirada', {
          description: 'Faça login novamente.'
        })
        if (reason === 'idle') toast.warning('Desconectado por inatividade')
      },
      isRefreshTokenExpired: () => {
        const { refreshExpiresIn, sessionStartedAt } = get()
        if (!refreshExpiresIn || !sessionStartedAt) return false
        return Date.now() >= sessionStartedAt + refreshExpiresIn * 1000
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(getStorage),
      partialize: s => ({
        user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken,
        isAuthenticated: s.isAuthenticated, rememberMe: s.rememberMe,
        refreshExpiresIn: s.refreshExpiresIn, sessionStartedAt: s.sessionStartedAt,
      }),
    }
  )
)

