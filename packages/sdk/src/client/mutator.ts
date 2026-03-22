import axios, { AxiosError, AxiosRequestConfig } from 'axios'
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

const axiosInstance = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_KEY)

  if (token) config.headers['Authorization'] = `Bearer ${token}`

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 0
    const message =
      error.response?.data?.message ?? `Request failed with status ${status}`

    throw new ApiError(status, message)
  },
)

export function configureAxios(baseURL: string) {
  axiosInstance.defaults.baseURL = baseURL
}

export async function apiMutator<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.request<{ data: T } | T>(config)
  const json = response.data

  return (json as { data?: T }).data !== undefined
    ? (json as { data: T }).data
    : (json as T)
}
