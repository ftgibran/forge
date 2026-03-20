'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { User } from '../../types'

interface UpdateUserInput {
  id: string
  data: { email?: string; password?: string; name?: string }
}

export function useUpdateUser(
  options?: Omit<
    UseMutationOptions<User, ApiError, UpdateUserInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<User, ApiError, UpdateUserInput>({
    mutationFn: ({ id, data }) => client.patch(`/users/${id}`, data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
