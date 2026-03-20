'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { PaginatedList, Product, ProductQueryParams } from '../../types'

export function useProducts(
  params: ProductQueryParams = {},
  options?: Omit<
    UseQueryOptions<PaginatedList<Product>, ApiError>,
    'queryKey' | 'queryFn'
  >,
) {
  const client = useApiClient()
  return useQuery<PaginatedList<Product>, ApiError>({
    queryKey: queryKeys.products.list(params),
    queryFn: () => {
      const sp = new URLSearchParams()
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') sp.set(k, String(v))
      })
      return client.get(`/products${sp.toString() ? `?${sp}` : ''}`)
    },
    ...options,
  })
}
