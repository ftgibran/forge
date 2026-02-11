import type { Cart } from '@/types'

import { api } from '../api-client'

export const cartApi = {
  get: () => api.get<Cart>('/cart'),
  addItem: (variantId: string, quantity = 1) =>
    api.post<Cart>('/cart/items', { variantId, quantity }),
  updateItem: (itemId: string, quantity: number) =>
    api.patch<Cart>(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => api.delete<Cart>(`/cart/items/${itemId}`),
  clear: () => api.delete<void>('/cart'),
}
