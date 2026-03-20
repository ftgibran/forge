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

interface CreateRoleInput {
  name: string
  description?: string
}

export function useCreateRole(
  options?: Omit<
    UseMutationOptions<Role, ApiError, CreateRoleInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<Role, ApiError, CreateRoleInput>({
    mutationFn: (data) => client.post('/roles', data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
