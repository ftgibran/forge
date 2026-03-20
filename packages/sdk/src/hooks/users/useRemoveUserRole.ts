'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'

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
