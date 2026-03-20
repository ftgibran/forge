'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { PaginatedList, Role } from '../../types'

export function useRoles(
  page: number,
  limit: number,
  options?: Omit<
    UseQueryOptions<PaginatedList<Role>, ApiError>,
    'queryKey' | 'queryFn'
  >,
) {
  const client = useApiClient()

  return useQuery<PaginatedList<Role>, ApiError>({
    queryKey: queryKeys.roles.list(page, limit),
    queryFn: () => client.get(`/roles?page=${page}&limit=${limit}`),
    ...options,
  })
}
