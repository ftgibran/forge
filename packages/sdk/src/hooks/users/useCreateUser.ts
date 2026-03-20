'use client'

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { ApiError } from '../../client/api-client'
import type { User } from '../../types'

interface CreateUserInput {
  email: string
  password: string
  name: string
}

export function useCreateUser(
  options?: Omit<
    UseMutationOptions<User, ApiError, CreateUserInput>,
    'mutationFn'
  >,
) {
  const client = useApiClient()
  const queryClient = useQueryClient()
  return useMutation<User, ApiError, CreateUserInput>({
    mutationFn: (data) => client.post('/users', data),
    onSuccess: (data, variables, context, meta) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
