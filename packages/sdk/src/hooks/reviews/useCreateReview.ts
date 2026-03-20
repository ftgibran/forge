'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { Review } from '../../types'

interface CreateReviewInput {
  productId: string
  rating: number
  title?: string
  comment?: string
}

export function useCreateReview(
  options?: Omit<
    UseMutationOptions<Review, ApiError, CreateReviewInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<Review, ApiError, CreateReviewInput>({
    mutationFn: (data) => client.post('/reviews', data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
