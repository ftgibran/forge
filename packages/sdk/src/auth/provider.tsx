'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useCookies } from 'react-cookie'

import { decodeJwt, type JwtPayload } from '@app/utils'
import { useApiClient } from '../client/context'
import type { AuthResponse, User } from '../types'
import { AuthContext } from './context'

const TOKEN_KEY = 'token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApiClient()
  const [cookies, setCookie, removeCookie] = useCookies([TOKEN_KEY])
  const [user, setUser] = useState<User | null>(null)
  const [tokenPayload, setTokenPayload] = useState<JwtPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
    [setCookie],
  )

  useEffect(() => {
    const token = getToken()

    if (!token) {
      setIsLoading(false)
      return
    }

    client
      .get<User>('/auth/me')
      .then((u) => {
        setUser(u)
        setTokenPayload(decodeJwt(token))
      })
      .catch(() => removeCookie(TOKEN_KEY))
      .finally(() => setIsLoading(false))
  }, [client, getToken, removeCookie])

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
  }, [removeCookie])

  return (
    <AuthContext.Provider
      value={{
        user,
        tokenPayload,
        isLoading,
        getToken,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
