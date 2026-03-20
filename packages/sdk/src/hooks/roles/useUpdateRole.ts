'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
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
