import type { JwtPayload } from '@app/utils'
import { useState } from 'react'
import { useCookies } from 'react-cookie'

import type { User } from '../../types'
import { TOKEN_KEY } from '../constants'
import type { AuthParams } from './useAuth'

export type UseAuthBaseReturn = ReturnType<typeof useAuthBase>

export function useAuthBase(params: AuthParams = {}) {
  const [cookies, setCookie, removeCookie] = useCookies([TOKEN_KEY])
  const [user, setUser] = useState<User | null>(null)
  const [tokenPayload, setTokenPayload] = useState<JwtPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  return {
    ...params,

    cookies,
    setCookie,
    removeCookie,

    user,
    setUser,

    tokenPayload,
    setTokenPayload,

    isLoading,
    setIsLoading,
  }
}
