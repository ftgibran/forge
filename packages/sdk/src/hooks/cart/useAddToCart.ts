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

interface AddToCartInput {
  variantId: string
  quantity?: number
}

export function useAddToCart(
  options?: Omit<
    UseMutationOptions<Cart, ApiError, AddToCartInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<Cart, ApiError, AddToCartInput>({
    mutationFn: (data) => client.post('/cart/items', data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.root })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
