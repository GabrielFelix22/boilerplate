import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/solicitacoes')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/solicitacoes"!</div>;
}
