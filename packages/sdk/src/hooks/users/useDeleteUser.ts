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

export function useDeleteUser(
  options?: Omit<UseMutationOptions<User, ApiError, string>, 'mutationFn'>,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<User, ApiError, string>({
    mutationFn: (userId) => client.delete(`/users/${userId}`),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
