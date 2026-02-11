import type { Category } from '@/types'

import { api } from '../api-client'

export const categoriesApi = {
  list: () => api.get<Category[]>('/categories'),
  getBySlug: (slug: string) => api.get<Category>(`/categories/${slug}`),
}
