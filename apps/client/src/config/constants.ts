import { getEnvString } from '@app/utils'

export const API_URL = getEnvString(
  process.env.NEXT_PUBLIC_API_URL,
  'http://localhost:8080/api',
)

export const IS_LOCALHOST = /(localhost|127\.0\.0\.1)/.test(API_URL)
