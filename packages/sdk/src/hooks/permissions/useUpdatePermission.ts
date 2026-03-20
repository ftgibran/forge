'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { Permission } from '../../types'

interface UpdatePermissionInput {
  id: string
  data: { action?: string; resource?: string; description?: string }
}

export function useUpdatePermission(
  options?: Omit<
    UseMutationOptions<Permission, ApiError, UpdatePermissionInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<Permission, ApiError, UpdatePermissionInput>({
    mutationFn: ({ id, data }) => client.patch(`/permissions/${id}`, data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
