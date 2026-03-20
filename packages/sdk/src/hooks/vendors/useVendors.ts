'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { PaginatedList, Vendor } from '../../types'

export function useVendors(
  page: number,
  limit: number,
  status?: string,
  options?: Omit<
    UseQueryOptions<PaginatedList<Vendor>, ApiError>,
    'queryKey' | 'queryFn'
  >,
) {
  const client = useApiClient()

  return useQuery<PaginatedList<Vendor>, ApiError>({
    queryKey: queryKeys.vendors.list(page, limit, status),
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })

      if (status) params.set('status', status)

      return client.get(`/vendors?${params}`)
    },
    ...options,
  })
}
