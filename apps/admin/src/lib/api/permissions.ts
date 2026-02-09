import type { PaginatedList, Permission } from '@/types'

import { api } from '../api-client'

export const permissionsApi = {
  list: (page = 1, limit = 100) =>
    api.get<PaginatedList<Permission>>(
      `/permissions?page=${page}&limit=${limit}`,
    ),
  get: (id: string) => api.get<Permission>(`/permissions/${id}`),
  create: (data: { action: string; resource: string; description?: string }) =>
    api.post<Permission>('/permissions', data),
  update: (
    id: string,
    data: { action?: string; resource?: string; description?: string },
  ) => api.patch<Permission>(`/permissions/${id}`, data),
  delete: (id: string) => api.delete<Permission>(`/permissions/${id}`),
}
