import { decodeJwt } from '@app/utils'
import { useMemo } from 'react'
import { useCookies } from 'react-cookie'

import type { AuthParams } from './useAuth'

export type UseAuthBaseReturn = ReturnType<typeof useAuthBase>

export function useAuthBase(params: AuthParams) {
  const { tokenKey } = params
  const [cookies, setCookie, removeCookie] = useCookies([tokenKey])

  const token = useMemo(
    () => (cookies[tokenKey] as string | undefined) ?? null,
    [cookies, tokenKey],
  )

  const currentUser = useMemo(() => (token ? decodeJwt(token) : null), [token])

  return {
    ...params,

    cookies,
    setCookie,
    removeCookie,

    token,
    currentUser,
  }
}
