'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { Permission } from '../../types'

export function usePermission(
  id: string,
  options?: Omit<UseQueryOptions<Permission, ApiError>, 'queryKey' | 'queryFn'>,
) {
  const client = useApiClient()
  return useQuery<Permission, ApiError>({
    queryKey: queryKeys.permissions.detail(id),
    queryFn: () => client.get(`/permissions/${id}`),
    ...options,
  })
}
