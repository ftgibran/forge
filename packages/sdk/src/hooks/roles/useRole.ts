'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { Role } from '../../types'

export function useRole(
  id: string,
  options?: Omit<UseQueryOptions<Role, ApiError>, 'queryKey' | 'queryFn'>,
) {
  const client = useApiClient()

  return useQuery<Role, ApiError>({
    queryKey: queryKeys.roles.detail(id),
    queryFn: () => client.get(`/roles/${id}`),
    ...options,
  })
}
