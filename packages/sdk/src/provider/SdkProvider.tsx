'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { FC, PropsWithChildren, useState } from 'react'
import { CookiesProvider } from 'react-cookie'

import { AuthProvider } from '../auth'
import { configureAxios } from '../client/mutator'

export type SdkProviderProps = PropsWithChildren<{
  apiUrl: string
}>

export const SdkProvider: FC<SdkProviderProps> = ({ apiUrl, children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 30, retry: 1 },
        },
      }),
  )

  useState(() => configureAxios(apiUrl))

  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </CookiesProvider>
  )
}
