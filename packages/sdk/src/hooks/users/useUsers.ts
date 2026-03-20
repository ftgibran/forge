'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { PaginatedList, User } from '../../types'

export function useUsers(
  page: number,
  limit: number,
  options?: Omit<
    UseQueryOptions<PaginatedList<User>, ApiError>,
    'queryKey' | 'queryFn'
  >,
) {
  const client = useApiClient()

  return useQuery<PaginatedList<User>, ApiError>({
    queryKey: queryKeys.users.list(page, limit),
    queryFn: () => client.get(`/users?page=${page}&limit=${limit}`),
    ...options,
  })
}
