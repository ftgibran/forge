'use client'

import { createContext } from '@app/utils'

import type { CreateClient } from '../createClient'
import {
  useApiClientBase,
  type UseApiClientBaseReturn,
} from './useApiClientBase'

export const [_ApiClientProvider, useApiClientContext] =
  createContext<UseApiClientReturn>({ strict: true })

export type UseApiClientReturn = ReturnType<typeof _useApiClient>

export interface ApiClientParams {
  apiUrl: string
}

/* eslint-disable react-hooks/rules-of-hooks */
export function _useApiClient(params: ApiClientParams) {
  const base: UseApiClientBaseReturn = useApiClientBase(params)

  return { ...base }
}
/* eslint-enable react-hooks/rules-of-hooks */

export function useApiClient(): CreateClient {
  return useApiClientContext().client
}
