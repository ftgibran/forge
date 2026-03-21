'use client'

import { type ChildrenWithContext, useChildrenWithContext } from '@app/utils'
import { QueryClientProvider } from '@tanstack/react-query'
import { FC } from 'react'

import { ApiClientConsumer } from './ApiClientConsumer'
import {
  _ApiClientProvider,
  _useApiClient,
  type ApiClientParams,
  type UseApiClientReturn,
} from './hooks/useApiClient'

export interface ApiClientProviderProps extends ApiClientParams {
  children: ChildrenWithContext<UseApiClientReturn>
}

export const ApiClientProvider: FC<ApiClientProviderProps> = (props) => {
  const { children, ...rest } = props

  const context: UseApiClientReturn = _useApiClient(rest)

  const childrenWithContext = useChildrenWithContext(children, context)

  return (
    <_ApiClientProvider value={context}>
      <QueryClientProvider client={context.queryClient}>
        <ApiClientConsumer>{childrenWithContext}</ApiClientConsumer>
      </QueryClientProvider>
    </_ApiClientProvider>
  )
}
