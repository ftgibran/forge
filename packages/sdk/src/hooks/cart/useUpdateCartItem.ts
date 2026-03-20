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

interface UpdateCartItemInput {
  itemId: string
  quantity: number
}

export function useUpdateCartItem(
  options?: Omit<
    UseMutationOptions<Cart, ApiError, UpdateCartItemInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<Cart, ApiError, UpdateCartItemInput>({
    mutationFn: ({ itemId, quantity }) =>
      client.patch(`/cart/items/${itemId}`, { quantity }),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.root })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
