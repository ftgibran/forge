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

interface CreateVendorInput {
  name: string
  slug: string
  description?: string
  logoUrl?: string
}

export function useCreateVendor(
  options?: Omit<
    UseMutationOptions<Vendor, ApiError, CreateVendorInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<Vendor, ApiError, CreateVendorInput>({
    mutationFn: (data) => client.post('/vendors', data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
