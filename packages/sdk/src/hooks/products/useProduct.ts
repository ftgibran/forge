'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { Product } from '../../types'

export function useProduct(
  id: string,
  options?: Omit<UseQueryOptions<Product, ApiError>, 'queryKey' | 'queryFn'>,
) {
  const client = useApiClient()
  return useQuery<Product, ApiError>({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => client.get(`/products/${id}`),
    ...options,
  })
}
