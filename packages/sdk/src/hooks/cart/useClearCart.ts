'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'

export function useClearCart(
  options?: Omit<UseMutationOptions<void, ApiError, void>, 'mutationFn'>,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, void>({
    mutationFn: () => client.delete('/cart'),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.root })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
