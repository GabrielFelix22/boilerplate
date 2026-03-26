import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/contratos')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/contratos"!</div>;
}
