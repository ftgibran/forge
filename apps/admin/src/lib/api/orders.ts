import type { Order, PaginatedList } from '@/types'

import { api } from '../api-client'

export const ordersApi = {
  list: (page = 1, limit = 10) =>
    api.get<PaginatedList<Order>>(`/orders?page=${page}&limit=${limit}`),
  get: (id: string) => api.get<Order>(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch<Order>(`/orders/${id}/status`, { status }),
}
