import { EventEffect, JwtPayload, useEventEffect } from '@app/utils'

import { useAuth } from '../useAuth'

export type AuthEventEffect = EventEffect<
  [currentUser: JwtPayload, token: string]
>

export function useAuthEffect(...effect: AuthEventEffect) {
  const { currentUser, token } = useAuth()

  return useEventEffect([currentUser, token], ...effect)
}
