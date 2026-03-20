'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { PaginatedList, Order } from '../../types'

export function useMyOrders(
  page: number,
  limit: number,
  options?: Omit<
    UseQueryOptions<PaginatedList<Order>, ApiError>,
    'queryKey' | 'queryFn'
  >,
) {
  const client = useApiClient()
  return useQuery<PaginatedList<Order>, ApiError>({
    queryKey: queryKeys.orders.my.list(page, limit),
    queryFn: () => client.get(`/orders/my?page=${page}&limit=${limit}`),
    ...options,
  })
}
