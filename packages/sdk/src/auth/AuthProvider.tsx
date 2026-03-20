'use client'

import { FC } from 'react'

import { type ChildrenWithContext, useChildrenWithContext } from '@app/utils'
import {
  _AuthProvider,
  type AuthParams,
  _useAuth,
  type UseAuthReturn,
} from './hooks/useAuth'
import { AuthConsumer } from './AuthConsumer'

export interface AuthProviderProps extends AuthParams {
  children: ChildrenWithContext<UseAuthReturn>
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children, ...rest } = props

  const context: UseAuthReturn = _useAuth(rest)

  const childrenWithContext = useChildrenWithContext(children, context)

  return (
    <_AuthProvider value={context}>
      <AuthConsumer>{childrenWithContext}</AuthConsumer>
    </_AuthProvider>
  )
}
