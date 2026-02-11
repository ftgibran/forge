import type { PaginatedList, Product } from '@/types'

import { api } from '../api-client'

export interface ProductQueryParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  vendorId?: string
  status?: string
  filamentType?: string
  sortBy?: string
}

export const productsApi = {
  list: (params: ProductQueryParams = {}) => {
    const query = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query.set(key, String(value))
      }
    })

    const qs = query.toString()

    return api.get<PaginatedList<Product>>(`/products${qs ? `?${qs}` : ''}`)
  },
  getBySlug: (slug: string) => api.get<Product>(`/products/${slug}`),
}
