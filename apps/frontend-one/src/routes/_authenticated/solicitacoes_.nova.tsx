import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/solicitacoes_/nova')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/solicitacoes_/nova"!</div>;
}
