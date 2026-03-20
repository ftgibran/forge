'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { Vendor } from '../../types'

export function useVendor(
  id: string,
  options?: Omit<UseQueryOptions<Vendor, ApiError>, 'queryKey' | 'queryFn'>,
) {
  const client = useApiClient()
  return useQuery<Vendor, ApiError>({
    queryKey: queryKeys.vendors.detail(id),
    queryFn: () => client.get(`/vendors/${id}`),
    ...options,
  })
}
