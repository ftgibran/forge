'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'
import { AuthProvider } from '../auth'
import { createClient } from '../client/api-client'
import { ApiClientContext } from '../client/context'

interface SdkProviderProps {
  apiUrl: string
  onUnauthorized?: () => void
  queryClient?: QueryClient
  devtools?: boolean
  children: ReactNode
}

export function SdkProvider({
  apiUrl,
  onUnauthorized,
  queryClient: externalClient,
  devtools = process.env.NODE_ENV !== 'production',
  children,
}: SdkProviderProps) {
  const [apiClient] = useState(() =>
    createClient({
      apiUrl,
      getToken: () =>
        typeof window !== 'undefined' ? localStorage.getItem('token') : null,
      onUnauthorized,
    }),
  )
  const [queryClient] = useState(
    () =>
      externalClient ??
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 30, retry: 1 },
        },
      }),
  )

  return (
    <ApiClientContext.Provider value={apiClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}

          {devtools && <ReactQueryDevtools initialIsOpen={false} />}
        </AuthProvider>
      </QueryClientProvider>
    </ApiClientContext.Provider>
  )
}
