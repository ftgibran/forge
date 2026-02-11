import type { Order, PaginatedList } from '@/types'

import { api } from '../api-client'

export interface CheckoutData {
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export const ordersApi = {
  checkout: (data: CheckoutData) => api.post<Order>('/orders/checkout', data),
  listMy: (page = 1, limit = 10) =>
    api.get<PaginatedList<Order>>(`/orders/my?page=${page}&limit=${limit}`),
  get: (id: string) => api.get<Order>(`/orders/${id}`),
}
