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

interface UpdateCategoryInput {
  id: string
  data: {
    name?: string
    slug?: string
    description?: string
    parentId?: string
  }
}

export function useUpdateCategory(
  options?: Omit<
    UseMutationOptions<Category, ApiError, UpdateCategoryInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<Category, ApiError, UpdateCategoryInput>({
    mutationFn: ({ id, data }) => client.patch(`/categories/${id}`, data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
