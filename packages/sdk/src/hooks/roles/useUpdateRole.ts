'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { Role } from '../../types'

interface UpdateRoleInput {
  id: string
  data: { name?: string; description?: string }
}

export function useUpdateRole(
  options?: Omit<
    UseMutationOptions<Role, ApiError, UpdateRoleInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<Role, ApiError, UpdateRoleInput>({
    mutationFn: ({ id, data }) => client.patch(`/roles/${id}`, data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
