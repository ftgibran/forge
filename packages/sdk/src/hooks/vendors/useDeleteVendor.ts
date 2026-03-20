'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { Vendor } from '../../types'

export function useDeleteVendor(
  options?: Omit<UseMutationOptions<Vendor, ApiError, string>, 'mutationFn'>,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<Vendor, ApiError, string>({
    mutationFn: (id) => client.delete(`/vendors/${id}`),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
