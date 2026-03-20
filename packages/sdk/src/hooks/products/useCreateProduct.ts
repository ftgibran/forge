'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { Product } from '../../types'

export function useCreateProduct(
  options?: Omit<
    UseMutationOptions<Product, ApiError, Record<string, unknown>>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<Product, ApiError, Record<string, unknown>>({
    mutationFn: (data) => client.post('/products', data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
