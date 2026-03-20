'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { Order, PaginatedList } from '../../types'

export function useOrders(
  page: number,
  limit: number,
  options?: Omit<
    UseQueryOptions<PaginatedList<Order>, ApiError>,
    'queryKey' | 'queryFn'
  >,
) {
  const client = useApiClient()

  return useQuery<PaginatedList<Order>, ApiError>({
    queryKey: queryKeys.orders.list(page, limit),
    queryFn: () => client.get(`/orders?page=${page}&limit=${limit}`),
    ...options,
  })
}
