import type { ILoginRequest, ILoginResponse } from './auth.types';

const MOCK_USER = { email: 'gabriel.felix@example.com', password: '@Felix10' };

function buildMockJwt() {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: 'mock-user-id',
      preferred_username: MOCK_USER.email,
      name: 'Mister',
      email: 'dev@dev.com',
      realm_access: { roles: ['admin'] },
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }),
  );
  return `${header}.${payload}.mock-signature`;
}

export function mockLogin(credentials: ILoginRequest): ILoginResponse {
  if (
    credentials.email !== MOCK_USER.email ||
    credentials.password !== MOCK_USER.password
  ) {
    throw new Error('Usuário ou senha inválidos');
  }

  const token = buildMockJwt();
  return {
    access_token: token,
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    refresh_expires_in: 86400,
    token_type: 'Bearer',
  };
}
