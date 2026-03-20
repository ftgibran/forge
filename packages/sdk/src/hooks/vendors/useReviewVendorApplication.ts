'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { VendorApplication } from '../../types'

interface ReviewVendorApplicationInput {
  id: string
  status: 'APPROVED' | 'REJECTED'
}

export function useReviewVendorApplication(
  options?: Omit<
    UseMutationOptions<
      VendorApplication,
      ApiError,
      ReviewVendorApplicationInput
    >,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<VendorApplication, ApiError, ReviewVendorApplicationInput>(
    {
      mutationFn: ({ id, status }) =>
        client.patch(`/vendor-applications/${id}/review`, { status }),
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
