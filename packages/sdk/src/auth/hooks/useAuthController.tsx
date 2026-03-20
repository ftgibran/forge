import { decodeJwt } from '@app/utils'
import { useCallback } from 'react'

import { useApiClient } from '../../client/context'
import type { AuthResponse } from '../../types'
import { TOKEN_KEY } from '../constants'
import type { UseAuthBaseReturn } from './useAuthBase'

export type UseAuthControllerReturn = ReturnType<typeof useAuthController>

export function useAuthController(base: UseAuthBaseReturn) {
  const client = useApiClient()

  const { cookies, setCookie, removeCookie, setUser, setTokenPayload } = base

  const getToken = useCallback(
    () => (cookies[TOKEN_KEY] as string | undefined) ?? null,
    [cookies],
  )

  const applyAuth = useCallback(
    (res: AuthResponse) => {
      const payload = decodeJwt(res.accessToken)
      const maxAge = payload
        ? payload.exp - Math.floor(Date.now() / 1000)
        : undefined

      setCookie(TOKEN_KEY, res.accessToken, { sameSite: 'lax', maxAge })
      setUser(res.user)
      setTokenPayload(payload)
    },
    [setCookie, setTokenPayload, setUser],
  )

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await client.post<AuthResponse>('/auth/login', {
        email,
        password,
      })

      applyAuth(res)
    },
    [client, applyAuth],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await client.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
      })

      applyAuth(res)
    },
    [client, applyAuth],
  )

  const logout = useCallback(() => {
    removeCookie(TOKEN_KEY)
    setUser(null)
    setTokenPayload(null)
    window.location.href = '/login'
  }, [removeCookie, setTokenPayload, setUser])

  return {
    getToken,
    login,
    register,
    logout,
  }
}
