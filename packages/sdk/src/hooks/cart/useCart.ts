'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { Cart } from '../../types'

export function useCart(
  options?: Omit<UseQueryOptions<Cart, ApiError>, 'queryKey' | 'queryFn'>,
) {
  const client = useApiClient()

  return useQuery<Cart, ApiError>({
    queryKey: queryKeys.cart.root,
    queryFn: () => client.get('/cart'),
    ...options,
  })
}
