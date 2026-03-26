import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/perfil')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/perfil"!</div>;
}
