'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'

interface RemoveRolePermissionInput {
  roleId: string
  permissionId: string
}

export function useRemoveRolePermission(
  options?: Omit<
    UseMutationOptions<unknown, ApiError, RemoveRolePermissionInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<unknown, ApiError, RemoveRolePermissionInput>({
    mutationFn: ({ roleId, permissionId }) =>
      client.delete(`/roles/${roleId}/permissions/${permissionId}`),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
