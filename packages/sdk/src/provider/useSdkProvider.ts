import { QueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { configureAxios } from '../http'
import type { SdkProviderProps } from './SdkProvider'

export function useSdkProvider({
  apiUrl,
  tokenKey,
}: Omit<SdkProviderProps, 'children'>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 30, retry: 1 },
        },
      }),
  )

  useState(() => configureAxios(apiUrl, tokenKey))

  return { queryClient }
}
