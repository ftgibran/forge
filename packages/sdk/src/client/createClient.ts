import axios, { AxiosError, AxiosInstance } from 'axios'
import Cookies from 'js-cookie'

import { TOKEN_KEY } from '../auth'

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
}

export interface CreateClient {
  get<T>(path: string): Promise<T>
  post<T>(path: string, body?: unknown): Promise<T>
  patch<T>(path: string, body?: unknown): Promise<T>
  delete<T>(path: string): Promise<T>
}

export function createClient(options: ApiClientOptions): CreateClient {
  const instance: AxiosInstance = axios.create({
    baseURL: options.apiUrl,
    headers: { 'Content-Type': 'application/json' },
  })

  instance.interceptors.request.use((config) => {
    const token = Cookies.get(TOKEN_KEY)

    if (token) config.headers['Authorization'] = `Bearer ${token}`

    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
      const status = error.response?.status ?? 0
      const message =
        error.response?.data?.message ?? `Request failed with status ${status}`

      throw new ApiError(status, message)
    },
  )

  async function request<T>(
    method: 'get' | 'post' | 'patch' | 'delete',
    path: string,
    body?: unknown,
  ): Promise<T> {
    const response = await instance.request<{ data: T } | T>({
      method,
      url: path,
      data: body,
    })

    const json = response.data

    return (json as { data?: T }).data !== undefined
      ? (json as { data: T }).data
      : (json as T)
  }

  return {
    get: <T>(path: string) => request<T>('get', path),
    post: <T>(path: string, body?: unknown) => request<T>('post', path, body),
    patch: <T>(path: string, body?: unknown) => request<T>('patch', path, body),
    delete: <T>(path: string) => request<T>('delete', path),
  }
}
