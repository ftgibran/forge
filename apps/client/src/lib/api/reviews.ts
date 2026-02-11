import type { PaginatedList, Review } from '@/types'

import { api } from '../api-client'

export const reviewsApi = {
  listByProduct: (productId: string, page = 1, limit = 10) =>
    api.get<PaginatedList<Review>>(
      `/reviews?productId=${productId}&page=${page}&limit=${limit}`,
    ),
  create: (data: {
    productId: string
    rating: number
    title?: string
    comment?: string
  }) => api.post<Review>('/reviews', data),
  update: (
    id: string,
    data: { rating?: number; title?: string; comment?: string },
  ) => api.patch<Review>(`/reviews/${id}`, data),
}
