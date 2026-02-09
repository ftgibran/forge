import type { PaginatedList, User } from '@/types'

import { api } from '../api-client'

export const usersApi = {
  list: (page = 1, limit = 10) =>
    api.get<PaginatedList<User>>(`/users?page=${page}&limit=${limit}`),
  get: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: { email: string; password: string; name: string }) =>
    api.post<User>('/users', data),
  update: (
    id: string,
    data: { email?: string; password?: string; name?: string },
  ) => api.patch<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete<User>(`/users/${id}`),
  assignRole: (userId: string, roleId: string) =>
    api.post(`/users/${userId}/roles`, { roleId }),
  removeRole: (userId: string, roleId: string) =>
    api.delete(`/users/${userId}/roles/${roleId}`),
  assignPermission: (userId: string, permissionId: string) =>
    api.post(`/users/${userId}/permissions`, { permissionId }),
  removePermission: (userId: string, permissionId: string) =>
    api.delete(`/users/${userId}/permissions/${permissionId}`),
}
