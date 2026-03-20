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

interface CreateCategoryInput {
  name: string
  slug: string
  description?: string
  parentId?: string
}

export function useCreateCategory(
  options?: Omit<
    UseMutationOptions<Category, ApiError, CreateCategoryInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<Category, ApiError, CreateCategoryInput>({
    mutationFn: (data) => client.post('/categories', data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
