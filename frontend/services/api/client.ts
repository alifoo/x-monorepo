import { AuthError } from '@/services/auth/types';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiClientOptions = {
  baseUrl: string;
};

export function createApiClient({ baseUrl }: ApiClientOptions) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');

  async function request<T>(
    method: string,
    path: string,
    accessToken: string,
    body?: unknown,
  ): Promise<T> {
    const response = await fetch(`${normalizedBaseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      const message = payload?.error ?? 'Não foi possível concluir a solicitação.';

      if (response.status === 401) {
        throw new AuthError('Sessão inválida ou expirada. Faça login novamente.');
      }

      throw new ApiError(response.status, message);
    }

    return response.json() as Promise<T>;
  }

  return {
    get<T>(path: string, accessToken: string) {
      return request<T>('GET', path, accessToken);
    },
  };
}
