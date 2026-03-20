export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface ApiClientOptions {
  apiUrl: string
  getToken: () => string | null
  onUnauthorized?: () => void
}

export interface ApiClient {
  get<T>(path: string): Promise<T>
  post<T>(path: string, body?: unknown): Promise<T>
  patch<T>(path: string, body?: unknown): Promise<T>
  delete<T>(path: string): Promise<T>
}

export function createClient(options: ApiClientOptions): ApiClient {
  const { apiUrl, getToken } = options

  const onUnauthorized =
    options.onUnauthorized ??
    (() => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    })

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((init.headers as Record<string, string>) ?? {}),
    }

    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${apiUrl}${path}`, { ...init, headers })

    if (res.status === 401) {
      onUnauthorized()
      throw new ApiError(401, 'Unauthorized')
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))

      throw new ApiError(
        res.status,
        (body as { message?: string }).message ??
          `Request failed with status ${res.status}`,
      )
    }

    const json = (await res.json()) as { data?: T } | T

    return (json as { data?: T }).data !== undefined
      ? ((json as { data: T }).data as T)
      : (json as T)
  }

  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    patch: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  }
}
