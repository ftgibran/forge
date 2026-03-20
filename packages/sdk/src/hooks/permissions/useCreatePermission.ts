'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { Permission } from '../../types'

interface CreatePermissionInput {
  action: string
  resource: string
  description?: string
}

export function useCreatePermission(
  options?: Omit<
    UseMutationOptions<Permission, ApiError, CreatePermissionInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<Permission, ApiError, CreatePermissionInput>({
    mutationFn: (data) => client.post('/permissions', data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
