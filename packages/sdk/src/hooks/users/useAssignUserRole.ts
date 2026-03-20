'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'

interface AssignUserRoleInput {
  userId: string
  roleId: string
}

export function useAssignUserRole(
  options?: Omit<
    UseMutationOptions<unknown, ApiError, AssignUserRoleInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<unknown, ApiError, AssignUserRoleInput>({
    mutationFn: ({ userId, roleId }) =>
      client.post(`/users/${userId}/roles`, { roleId }),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
