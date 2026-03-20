'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { Review } from '../../types'

interface UpdateReviewInput {
  id: string
  data: { rating?: number; title?: string; comment?: string }
}

export function useUpdateReview(
  options?: Omit<
    UseMutationOptions<Review, ApiError, UpdateReviewInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<Review, ApiError, UpdateReviewInput>({
    mutationFn: ({ id, data }) => client.patch(`/reviews/${id}`, data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
