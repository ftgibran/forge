'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { Order, ShippingAddress } from '../../types'

interface CheckoutInput {
  shippingAddress: ShippingAddress
}

export function useCheckout(
  options?: Omit<
    UseMutationOptions<Order, ApiError, CheckoutInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<Order, ApiError, CheckoutInput>({
    mutationFn: (data) => client.post('/orders/checkout', data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.my.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.root })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
