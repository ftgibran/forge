import { AxiosRequestConfig } from 'axios'

import { axiosInstance } from './instance'

export async function httpRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.request<{ data: T } | T>(config)
  const json = response.data

  return (json as { data?: T }).data !== undefined
    ? (json as { data: T }).data
    : (json as T)
}
