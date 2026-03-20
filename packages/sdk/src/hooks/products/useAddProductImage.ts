'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { ProductImage } from '../../types'

interface AddProductImageInput {
  productId: string
  data: { url: string; altText?: string; position?: number }
}

export function useAddProductImage(
  options?: Omit<
    UseMutationOptions<ProductImage, ApiError, AddProductImageInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<ProductImage, ApiError, AddProductImageInput>({
    mutationFn: ({ productId, data }) =>
      client.post(`/products/${productId}/images`, data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
