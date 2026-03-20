'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'

interface RemoveUserPermissionInput {
  userId: string
  permissionId: string
}

export function useRemoveUserPermission(
  options?: Omit<
    UseMutationOptions<unknown, ApiError, RemoveUserPermissionInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<unknown, ApiError, RemoveUserPermissionInput>({
    mutationFn: ({ userId, permissionId }) =>
      client.delete(`/users/${userId}/permissions/${permissionId}`),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
