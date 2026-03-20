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

export function useDeleteReview(
  options?: Omit<UseMutationOptions<Review, ApiError, string>, 'mutationFn'>,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<Review, ApiError, string>({
    mutationFn: (id) => client.delete(`/reviews/${id}`),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
