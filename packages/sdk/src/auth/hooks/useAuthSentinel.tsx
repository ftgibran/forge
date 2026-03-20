import { decodeJwt } from '@app/utils'
import { useEffect } from 'react'

import { useApiClient } from '../../client/context'
import type { User } from '../../types'
import { TOKEN_KEY } from '../constants'
import { useAuth } from './useAuth'

export function useAuthSentinel() {
  const { getToken, removeCookie, setTokenPayload, setUser, setIsLoading } =
    useAuth()

  const client = useApiClient()

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
  }, [client, getToken, removeCookie, setIsLoading, setTokenPayload, setUser])
}
