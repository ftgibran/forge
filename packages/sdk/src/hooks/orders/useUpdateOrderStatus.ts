'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { Order } from '../../types'

interface UpdateOrderStatusInput {
  id: string
  status: string
}

export function useUpdateOrderStatus(
  options?: Omit<
    UseMutationOptions<Order, ApiError, UpdateOrderStatusInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<Order, ApiError, UpdateOrderStatusInput>({
    mutationFn: ({ id, status }) =>
      client.patch(`/orders/${id}/status`, { status }),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
