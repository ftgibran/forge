import { FC, PropsWithChildren } from 'react'

export const AuthConsumer: FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>
}

AuthConsumer.displayName = 'AuthConsumer'
