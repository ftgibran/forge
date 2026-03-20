'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { Vendor } from '../../types'

export function useVendorBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<Vendor, ApiError>, 'queryKey' | 'queryFn'>,
) {
  const client = useApiClient()

  return useQuery<Vendor, ApiError>({
    queryKey: queryKeys.vendors.bySlug(slug),
    queryFn: () => client.get(`/vendors/${slug}`),
    ...options,
  })
}
