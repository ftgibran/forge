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

interface UpdateProductImageInput {
  productId: string
  imageId: string
  data: { url?: string; altText?: string; position?: number }
}

export function useUpdateProductImage(
  options?: Omit<
    UseMutationOptions<ProductImage, ApiError, UpdateProductImageInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<ProductImage, ApiError, UpdateProductImageInput>({
    mutationFn: ({ productId, imageId, data }) =>
      client.patch(`/products/${productId}/images/${imageId}`, data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
