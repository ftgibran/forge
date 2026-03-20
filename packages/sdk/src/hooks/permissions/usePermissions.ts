'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { PaginatedList, Permission } from '../../types'

export function usePermissions(
  page: number,
  limit: number,
  options?: Omit<
    UseQueryOptions<PaginatedList<Permission>, ApiError>,
    'queryKey' | 'queryFn'
  >,
) {
  const client = useApiClient()

  return useQuery<PaginatedList<Permission>, ApiError>({
    queryKey: queryKeys.permissions.list(page, limit),
    queryFn: () => client.get(`/permissions?page=${page}&limit=${limit}`),
    ...options,
  })
}
