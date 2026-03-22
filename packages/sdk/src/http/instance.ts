import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'

import { ApiError } from './error'

let _tokenKey = 'token'

export const axiosInstance = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get(_tokenKey)

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

export function configureAxios(baseURL: string, tokenKey: string) {
  axiosInstance.defaults.baseURL = baseURL
  _tokenKey = tokenKey
}
