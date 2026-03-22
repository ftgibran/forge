import { decodeJwt } from '@app/utils'
import { useMemo } from 'react'
import { useCookies } from 'react-cookie'

import { TOKEN_KEY } from '../constants'
import type { AuthParams } from './useAuth'

export type UseAuthBaseReturn = ReturnType<typeof useAuthBase>

export function useAuthBase(params: AuthParams = {}) {
  const [cookies, setCookie, removeCookie] = useCookies([TOKEN_KEY])

  const currentUser = useMemo(() => {
    const token = cookies[TOKEN_KEY] as string | undefined

    return token ? decodeJwt(token) : null
  }, [cookies])

  return {
    ...params,

    cookies,
    setCookie,
    removeCookie,

    currentUser,
  }
}
