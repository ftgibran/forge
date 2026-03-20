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

interface UpdateProductInput {
  id: string
  data: Record<string, unknown>
}

export function useUpdateProduct(
  options?: Omit<
    UseMutationOptions<Product, ApiError, UpdateProductInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<Product, ApiError, UpdateProductInput>({
    mutationFn: ({ id, data }) => client.patch(`/products/${id}`, data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
