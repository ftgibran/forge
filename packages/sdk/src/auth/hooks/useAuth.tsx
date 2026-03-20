'use client'

import { createContext, type JwtPayload } from '@app/utils'

import { useAuthBase, type UseAuthBaseReturn } from './useAuthBase'
import {
  useAuthController,
  type UseAuthControllerReturn,
} from './useAuthController'

export type { JwtPayload }

export const [_AuthProvider, useAuth] = createContext<UseAuthReturn>({
  strict: true,
})

export type UseAuthReturn = ReturnType<typeof _useAuth>

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthParams {}

/* eslint-disable react-hooks/rules-of-hooks */
export function _useAuth(params: AuthParams = {}) {
  const base: UseAuthBaseReturn = useAuthBase(params)
  const controller: UseAuthControllerReturn = useAuthController(base)

  return { ...base, ...controller }
}
/* eslint-enable react-hooks/rules-of-hooks */
