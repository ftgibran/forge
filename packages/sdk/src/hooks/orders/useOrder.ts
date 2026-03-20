'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { Order } from '../../types'

export function useOrder(
  id: string,
  options?: Omit<UseQueryOptions<Order, ApiError>, 'queryKey' | 'queryFn'>,
) {
  const client = useApiClient()
  return useQuery<Order, ApiError>({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => client.get(`/orders/${id}`),
    ...options,
  })
}
