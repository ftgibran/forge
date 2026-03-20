'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { PaginatedList, VendorApplication } from '../../types'

export function useVendorApplications(
  page: number,
  limit: number,
  options?: Omit<
    UseQueryOptions<PaginatedList<VendorApplication>, ApiError>,
    'queryKey' | 'queryFn'
  >,
) {
  const client = useApiClient()
  return useQuery<PaginatedList<VendorApplication>, ApiError>({
    queryKey: queryKeys.vendors.applications.list(page, limit),
    queryFn: () =>
      client.get(`/vendor-applications?page=${page}&limit=${limit}`),
    ...options,
  })
}
