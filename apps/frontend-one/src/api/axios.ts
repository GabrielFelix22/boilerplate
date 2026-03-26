import { toast } from '@repo/ui';
import { resolveErrorMessage } from '@repo/utils';
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type CreateAxiosDefaults,
} from 'axios';
import { useAuthStore } from '@/stores/auth.store';

export const BASE_URL = import.meta.env.VITE_API_URL;

const baseConfig: CreateAxiosDefaults = {
  withCredentials: true,
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 30_000,
};

export const axiosInstance: AxiosInstance = axios.create(baseConfig);
export const instanceWithoutInterceptors: AxiosInstance =
  axios.create(baseConfig);

const showErrorToast = (err: AxiosError) => toast.error(resolveErrorMessage(err));

const logoutAndRedirect = () => {
  useAuthStore.getState().logout('expired');
  const redirect = encodeURIComponent(
    window.location.pathname + window.location.search,
  );
  window.location.replace(`/login?redirect=${redirect}`);
};

// --- instanceWithoutInterceptors: erros com toast, sem lógica de auth ---

instanceWithoutInterceptors.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!axios.isCancel(err)) showErrorToast(err);
    return Promise.reject(err);
  },
);

// --- axiosInstance: injeta token e gerencia refresh ---

axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

type RetryableConfig = AxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

const onTokenRefreshed = (token: string | null) => {
  const subs = [...refreshSubscribers];
  refreshSubscribers = [];
  for (const cb of subs) cb(token);
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (axios.isCancel(err)) return Promise.reject(err);

    const status = err.response?.status;
    const original = err.config as RetryableConfig | undefined;

    if (status !== 401 || !original) {
      showErrorToast(err);
      return Promise.reject(err);
    }

    if (original.url?.includes('/auth/refresh-token') || original._retry) {
      logoutAndRedirect();
      return Promise.reject(err);
    }

    original._retry = true;
    const { refreshToken } = useAuthStore.getState();

    if (!refreshToken) {
      logoutAndRedirect();
      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshSubscribers.push((newToken) => {
          if (!newToken) {
            reject(err);
            return;
          }
          original.headers = {
            ...original.headers,
            Authorization: `Bearer ${newToken}`,
          };
          resolve(axiosInstance(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await instanceWithoutInterceptors.post(
        '/auth/refresh-token',
        { refreshToken },
      );
      useAuthStore.getState().setSession(data);
      const { accessToken: newToken } = useAuthStore.getState();
      onTokenRefreshed(newToken ?? null);
      if (!newToken) {
        logoutAndRedirect();
        return Promise.reject(err);
      }
      original.headers = {
        ...original.headers,
        Authorization: `Bearer ${newToken}`,
      };
      return axiosInstance(original);
    } catch (e) {
      onTokenRefreshed(null);
      logoutAndRedirect();
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);
