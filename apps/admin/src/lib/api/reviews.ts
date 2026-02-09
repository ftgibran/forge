import { api } from '../api-client'
import type { Review, PaginatedList } from '@/types'

export const reviewsApi = {
  listByProduct: (productId: string, page = 1, limit = 10) =>
    api.get<PaginatedList<Review>>(
      `/reviews/product/${productId}?page=${page}&limit=${limit}`,
    ),
  get: (id: string) => api.get<Review>(`/reviews/${id}`),
  delete: (id: string) => api.delete<Review>(`/reviews/${id}`),
}
