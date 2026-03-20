'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { Product } from '../../types'

export function useDeleteProduct(
  options?: Omit<UseMutationOptions<Product, ApiError, string>, 'mutationFn'>,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<Product, ApiError, string>({
    mutationFn: (id) => client.delete(`/products/${id}`),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
