'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'

interface AssignRolePermissionInput {
  roleId: string
  permissionId: string
}

export function useAssignRolePermission(
  options?: Omit<
    UseMutationOptions<unknown, ApiError, AssignRolePermissionInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<unknown, ApiError, AssignRolePermissionInput>({
    mutationFn: ({ roleId, permissionId }) =>
      client.post(`/roles/${roleId}/permissions`, { permissionId }),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
