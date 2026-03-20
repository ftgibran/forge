'use client'

import { type ChildrenWithContext, useChildrenWithContext } from '@app/utils'
import { FC } from 'react'

import { AuthConsumer } from './AuthConsumer'
import {
  _AuthProvider,
  _useAuth,
  type AuthParams,
  type UseAuthReturn,
} from './hooks/useAuth'

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
