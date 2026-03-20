'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { ProductVariant } from '../../types'

interface DeleteProductVariantInput {
  productId: string
  variantId: string
}

export function useDeleteProductVariant(
  options?: Omit<
    UseMutationOptions<ProductVariant, ApiError, DeleteProductVariantInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<ProductVariant, ApiError, DeleteProductVariantInput>({
    mutationFn: ({ productId, variantId }) =>
      client.delete(`/products/${productId}/variants/${variantId}`),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
