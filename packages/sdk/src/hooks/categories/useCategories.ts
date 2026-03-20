'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { Category } from '../../types'

export function useCategories(
  options?: Omit<UseQueryOptions<Category[], ApiError>, 'queryKey' | 'queryFn'>,
) {
  const client = useApiClient()

  return useQuery<Category[], ApiError>({
    queryKey: queryKeys.categories.all,
    queryFn: () => client.get('/categories'),
    ...options,
  })
}
