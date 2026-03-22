import { decodeJwt } from '@app/utils'
import { useCallback } from 'react'

import {
  login as apiLogin,
  register as apiRegister,
} from '../../generated/auth/auth'
import type { UseAuthBaseReturn } from './useAuthBase'

export type UseAuthControllerReturn = ReturnType<typeof useAuthController>

export function useAuthController(base: UseAuthBaseReturn) {
  const { tokenKey, setCookie, removeCookie } = base

  const applyAuth = useCallback(
    (accessToken: string) => {
      const payload = decodeJwt(accessToken)
      const maxAge = payload
        ? payload.exp - Math.floor(Date.now() / 1000)
        : undefined

      setCookie(tokenKey, accessToken, { sameSite: 'lax', maxAge })
    },
    [setCookie, tokenKey],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await apiRegister({ name, email, password })

      applyAuth(res.accessToken)
    },
    [applyAuth],
  )

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiLogin({ email, password })

      applyAuth(res.accessToken)
    },
    [applyAuth],
  )

  const logout = useCallback(() => {
    removeCookie(tokenKey)
    window.location.href = '/login'
  }, [removeCookie, tokenKey])

  return {
    register,
    login,
    logout,
  }
}
