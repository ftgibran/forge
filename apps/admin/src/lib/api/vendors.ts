import type { PaginatedList, Vendor, VendorApplication } from '@/types'

import { api } from '../api-client'

export const vendorsApi = {
  list: (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })

    if (status) params.set('status', status)

    return api.get<PaginatedList<Vendor>>(`/vendors?${params}`)
  },
  get: (id: string) => api.get<Vendor>(`/vendors/${id}`),
  create: (data: {
    name: string
    slug: string
    description?: string
    logoUrl?: string
  }) => api.post<Vendor>('/vendors', data),
  update: (
    id: string,
    data: {
      name?: string
      slug?: string
      description?: string
      logoUrl?: string
    },
  ) => api.patch<Vendor>(`/vendors/${id}`, data),
  delete: (id: string) => api.delete<Vendor>(`/vendors/${id}`),
  listApplications: (page = 1, limit = 10) =>
    api.get<PaginatedList<VendorApplication>>(
      `/vendor-applications?page=${page}&limit=${limit}`,
    ),
  reviewApplication: (id: string, status: 'APPROVED' | 'REJECTED') =>
    api.patch<VendorApplication>(`/vendor-applications/${id}/review`, {
      status,
    }),
}
