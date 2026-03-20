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

export function useDeleteRole(
  options?: Omit<UseMutationOptions<Role, ApiError, string>, 'mutationFn'>,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<Role, ApiError, string>({
    mutationFn: (id) => client.delete(`/roles/${id}`),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
