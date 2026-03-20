'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { Product } from '../../types'

export function useProductBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<Product, ApiError>, 'queryKey' | 'queryFn'>,
) {
  const client = useApiClient()
  return useQuery<Product, ApiError>({
    queryKey: queryKeys.products.bySlug(slug),
    queryFn: () => client.get(`/products/${slug}`),
    ...options,
  })
}
