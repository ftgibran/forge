'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ProductVariant } from '../../types'

interface AddProductVariantInput {
  productId: string
  data: Record<string, unknown>
}

export function useAddProductVariant(
  options?: Omit<
    UseMutationOptions<ProductVariant, ApiError, AddProductVariantInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<ProductVariant, ApiError, AddProductVariantInput>({
    mutationFn: ({ productId, data }) =>
      client.post(`/products/${productId}/variants`, data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
