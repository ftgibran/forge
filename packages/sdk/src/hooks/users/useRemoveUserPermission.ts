'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'

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
