'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { Category } from '../../types'

export function useCategory(
  id: string,
  options?: Omit<UseQueryOptions<Category, ApiError>, 'queryKey' | 'queryFn'>,
) {
  const client = useApiClient()

  return useQuery<Category, ApiError>({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => client.get(`/categories/${id}`),
    ...options,
  })
}
