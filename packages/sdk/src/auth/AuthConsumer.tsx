import { FC, PropsWithChildren } from 'react'

import { useAuthSentinel } from './hooks/useAuthSentinel'

export const AuthConsumer: FC<PropsWithChildren> = ({ children }) => {
  useAuthSentinel()

  return <>{children}</>
}

AuthConsumer.displayName = 'AuthConsumer'
