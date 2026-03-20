'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { Cart } from '../../types'

export function useRemoveCartItem(
  options?: Omit<UseMutationOptions<Cart, ApiError, string>, 'mutationFn'>,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<Cart, ApiError, string>({
    mutationFn: (itemId) => client.delete(`/cart/items/${itemId}`),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.root })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
