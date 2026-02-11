import type { Vendor, VendorApplication } from '@/types'

import { api } from '../api-client'

export const vendorsApi = {
  getBySlug: (slug: string) => api.get<Vendor>(`/vendors/${slug}`),
  getMe: () => api.get<Vendor>('/vendors/me'),
  create: (data: { name: string; slug: string; description?: string }) =>
    api.post<Vendor>('/vendors', data),
  createApplication: (vendorId: string, message: string) =>
    api.post<VendorApplication>(`/vendors/${vendorId}/applications`, {
      message,
    }),
}
