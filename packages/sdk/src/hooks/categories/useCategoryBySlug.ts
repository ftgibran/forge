'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { Category } from '../../types'

export function useCategoryBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<Category, ApiError>, 'queryKey' | 'queryFn'>,
) {
  const client = useApiClient()
  return useQuery<Category, ApiError>({
    queryKey: queryKeys.categories.bySlug(slug),
    queryFn: () => client.get(`/categories/${slug}`),
    ...options,
  })
}
