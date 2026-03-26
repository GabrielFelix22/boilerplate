import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout'
import { useAuthStore } from '@/stores/auth.store'
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    if (!useAuthStore.getState().isAuthenticated)
      throw redirect({ to: '/login', search: { redirect: location.pathname } })
  },
  component: AuthenticatedLayout,
})
