'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ProductImage } from '../../types'

interface DeleteProductImageInput {
  productId: string
  imageId: string
}

export function useDeleteProductImage(
  options?: Omit<
    UseMutationOptions<ProductImage, ApiError, DeleteProductImageInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<ProductImage, ApiError, DeleteProductImageInput>({
    mutationFn: ({ productId, imageId }) =>
      client.delete(`/products/${productId}/images/${imageId}`),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
