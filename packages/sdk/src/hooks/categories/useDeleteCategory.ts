'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { Category } from '../../types'

export function useDeleteCategory(
  options?: Omit<UseMutationOptions<Category, ApiError, string>, 'mutationFn'>,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<Category, ApiError, string>({
    mutationFn: (id) => client.delete(`/categories/${id}`),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
