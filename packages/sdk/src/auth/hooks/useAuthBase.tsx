import { useCookies } from 'react-cookie'
import { useState } from 'react'
import type { User } from '../../types'
import type { JwtPayload } from '@app/utils'
import type { AuthParams } from './useAuth'
import { TOKEN_KEY } from '../constants'

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
