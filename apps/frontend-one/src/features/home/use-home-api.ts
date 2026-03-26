import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axios';

const ENDPOINT = '/home'

export const homeKeys = {
  all: ['home'] as const,
  home: () => [...homeKeys.all, 'home'] as const,
}

async function getHome() {
  const { data } = await axiosInstance.get(ENDPOINT);
  return data;
}

export function useHome() {
  return useQuery({
    queryKey: homeKeys.home(),
    queryFn: getHome,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}