import { getEnvString } from '@app/utils'

export const API_URL = getEnvString(
  process.env.NEXT_PUBLIC_API_URL,
  'http://localhost:8080/api',
)
