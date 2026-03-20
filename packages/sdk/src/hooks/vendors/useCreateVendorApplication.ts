'use client'

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { VendorApplication } from '../../types'

interface CreateVendorApplicationInput {
  vendorId: string
  message: string
}

export function useCreateVendorApplication(
  options?: Omit<
    UseMutationOptions<
      VendorApplication,
      ApiError,
      CreateVendorApplicationInput
    >,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()

  return useMutation<VendorApplication, ApiError, CreateVendorApplicationInput>(
    {
      mutationFn: ({ vendorId, message }) =>
        client.post(`/vendors/${vendorId}/applications`, { message }),
      onSuccess: (data, variables, context, meta) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.vendors.applications.all,
        })
        options?.onSuccess?.(data, variables, context, meta)
      },
      ...options,
    },
  )
}
