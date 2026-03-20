'use client'

import { createContext, useContext } from 'react'
import type { JwtPayload } from '@app/utils'
import type { User } from '../types'

export type { JwtPayload }

export interface AuthContextValue {
  user: User | null
  tokenPayload: JwtPayload | null
  isLoading: boolean
  getToken: () => string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)

  if (!ctx) throw new Error('useAuth must be used within AuthProvider')

  return ctx
}
