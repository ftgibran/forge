import type { Category } from '@/types'

import { api } from '../api-client'

export const categoriesApi = {
  list: () => api.get<Category[]>('/categories'),
  get: (id: string) => api.get<Category>(`/categories/${id}`),
  create: (data: {
    name: string
    slug: string
    description?: string
    parentId?: string
  }) => api.post<Category>('/categories', data),
  update: (
    id: string,
    data: {
      name?: string
      slug?: string
      description?: string
      parentId?: string
    },
  ) => api.patch<Category>(`/categories/${id}`, data),
  delete: (id: string) => api.delete<Category>(`/categories/${id}`),
}
