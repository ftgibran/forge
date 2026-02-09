import type { PaginatedList, Role } from '@/types'

import { api } from '../api-client'

export const rolesApi = {
  list: (page = 1, limit = 10) =>
    api.get<PaginatedList<Role>>(`/roles?page=${page}&limit=${limit}`),
  get: (id: string) => api.get<Role>(`/roles/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post<Role>('/roles', data),
  update: (id: string, data: { name?: string; description?: string }) =>
    api.patch<Role>(`/roles/${id}`, data),
  delete: (id: string) => api.delete<Role>(`/roles/${id}`),
  assignPermission: (roleId: string, permissionId: string) =>
    api.post(`/roles/${roleId}/permissions`, { permissionId }),
  removePermission: (roleId: string, permissionId: string) =>
    api.delete(`/roles/${roleId}/permissions/${permissionId}`),
}
