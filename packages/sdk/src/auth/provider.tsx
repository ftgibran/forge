'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'

import { decodeJwt, type JwtPayload } from '@app/utils'
import { useApiClient } from '../client/context'
import type { AuthResponse, User } from '../types'
import { AuthContext } from './context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApiClient()
  const [user, setUser] = useState<User | null>(null)
  const [tokenPayload, setTokenPayload] = useState<JwtPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getToken = useCallback(
    () =>
      typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    [],
  )

  const applyAuth = useCallback((res: AuthResponse) => {
    localStorage.setItem('token', res.accessToken)
    setUser(res.user)
    setTokenPayload(decodeJwt(res.accessToken))
  }, [])

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
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setIsLoading(false))
  }, [client, getToken])

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
    localStorage.removeItem('token')
    setUser(null)
    setTokenPayload(null)
    window.location.href = '/login'
  }, [])

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
