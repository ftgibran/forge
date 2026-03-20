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

interface UpdateProductVariantInput {
  productId: string
  variantId: string
  data: Record<string, unknown>
}

export function useUpdateProductVariant(
  options?: Omit<
    UseMutationOptions<ProductVariant, ApiError, UpdateProductVariantInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<ProductVariant, ApiError, UpdateProductVariantInput>({
    mutationFn: ({ productId, variantId, data }) =>
      client.patch(`/products/${productId}/variants/${variantId}`, data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
