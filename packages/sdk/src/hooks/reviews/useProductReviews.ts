'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import type { ApiError } from '../../client/api-client'
import { useApiClient } from '../../client/context'
import { queryKeys } from '../../keys'
import type { PaginatedList, Review } from '../../types'

export function useProductReviews(
  productId: string,
  page: number,
  limit: number,
  options?: Omit<
    UseQueryOptions<PaginatedList<Review>, ApiError>,
    'queryKey' | 'queryFn'
  >,
) {
  const client = useApiClient()

  return useQuery<PaginatedList<Review>, ApiError>({
    queryKey: queryKeys.reviews.byProduct(productId, page, limit),
    queryFn: () =>
      client.get(`/reviews/product/${productId}?page=${page}&limit=${limit}`),
    enabled: !!productId,
    ...options,
  })
}
