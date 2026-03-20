'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { User } from '../../types'

export function useUser(
  id: string,
  options?: Omit<UseQueryOptions<User, ApiError>, 'queryKey' | 'queryFn'>,
) {
  const client = useApiClient()
  return useQuery<User, ApiError>({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => client.get(`/users/${id}`),
    ...options,
  })
}
