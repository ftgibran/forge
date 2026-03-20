'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'

interface RemoveUserRoleInput {
  userId: string
  roleId: string
}

export function useRemoveUserRole(
  options?: Omit<
    UseMutationOptions<unknown, ApiError, RemoveUserRoleInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<unknown, ApiError, RemoveUserRoleInput>({
    mutationFn: ({ userId, roleId }) =>
      client.delete(`/users/${userId}/roles/${roleId}`),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
