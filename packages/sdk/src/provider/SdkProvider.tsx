'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { FC, PropsWithChildren } from 'react'
import { CookiesProvider } from 'react-cookie'

import { AuthProvider } from '../auth'
import { useSdkProvider } from './useSdkProvider'

export type SdkProviderProps = PropsWithChildren<{
  apiUrl: string
  tokenKey: string
}>

export const SdkProvider: FC<SdkProviderProps> = (props) => {
  const { apiUrl, tokenKey, children } = props

  const { queryClient } = useSdkProvider({ apiUrl, tokenKey })

  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider tokenKey={tokenKey}>{children}</AuthProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </CookiesProvider>
  )
}
