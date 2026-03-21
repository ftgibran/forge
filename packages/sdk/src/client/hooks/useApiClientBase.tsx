import { QueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import type { CreateClient } from '../createClient'
import { createClient } from '../createClient'
import { configureAxios } from '../mutator'
import type { ApiClientParams } from './useApiClient'

export type UseApiClientBaseReturn = ReturnType<typeof useApiClientBase>

export function useApiClientBase(params: ApiClientParams) {
  const [client] = useState<CreateClient>(() => {
    configureAxios(params.apiUrl)

    return createClient(params)
  })

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 30, retry: 1 },
        },
      }),
  )

  return { ...params, client, queryClient }
}
