import { decodeJwt } from '@app/utils'
import { useCallback } from 'react'

import {
  login as apiLogin,
  register as apiRegister,
} from '../../generated/auth/auth'
import { TOKEN_KEY } from '../constants'
import type { UseAuthBaseReturn } from './useAuthBase'

export type UseAuthControllerReturn = ReturnType<typeof useAuthController>

export function useAuthController(base: UseAuthBaseReturn) {
  const { cookies, setCookie, removeCookie } = base

  const getToken = useCallback(
    () => (cookies[TOKEN_KEY] as string | undefined) ?? null,
    [cookies],
  )

  const applyAuth = useCallback(
    (accessToken: string) => {
      const payload = decodeJwt(accessToken)
      const maxAge = payload
        ? payload.exp - Math.floor(Date.now() / 1000)
        : undefined

      setCookie(TOKEN_KEY, accessToken, { sameSite: 'lax', maxAge })
    },
    [setCookie],
  )

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiLogin({ email, password })

      applyAuth(res.accessToken)
    },
    [applyAuth],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await apiRegister({ name, email, password })

      applyAuth(res.accessToken)
    },
    [applyAuth],
  )

  const logout = useCallback(() => {
    removeCookie(TOKEN_KEY)
    window.location.href = '/login'
  }, [removeCookie])

  return {
    getToken,
    login,
    register,
    logout,
  }
}
