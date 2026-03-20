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

export function useDeletePermission(
  options?: Omit<
    UseMutationOptions<Permission, ApiError, string>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<Permission, ApiError, string>({
    mutationFn: (id) => client.delete(`/permissions/${id}`),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
