import type {
  PaginatedList,
  Product,
  ProductImage,
  ProductVariant,
} from '@/types'

import { api } from '../api-client'

export const productsApi = {
  list: (params?: {
    page?: number
    limit?: number
    search?: string
    categoryId?: string
    vendorId?: string
    status?: string
    filamentType?: string
    sortBy?: string
  }) => {
    const sp = new URLSearchParams()

    if (params?.page) sp.set('page', String(params.page))

    if (params?.limit) sp.set('limit', String(params.limit))

    if (params?.search) sp.set('search', params.search)

    if (params?.categoryId) sp.set('categoryId', params.categoryId)

    if (params?.vendorId) sp.set('vendorId', params.vendorId)

    if (params?.status) sp.set('status', params.status)

    if (params?.filamentType) sp.set('filamentType', params.filamentType)

    if (params?.sortBy) sp.set('sortBy', params.sortBy)

    return api.get<PaginatedList<Product>>(`/products?${sp}`)
  },
  get: (id: string) => api.get<Product>(`/products/${id}`),
  create: (data: Record<string, unknown>) =>
    api.post<Product>('/products', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch<Product>(`/products/${id}`, data),
  delete: (id: string) => api.delete<Product>(`/products/${id}`),

  // Variants
  addVariant: (productId: string, data: Record<string, unknown>) =>
    api.post<ProductVariant>(`/products/${productId}/variants`, data),
  updateVariant: (
    productId: string,
    variantId: string,
    data: Record<string, unknown>,
  ) =>
    api.patch<ProductVariant>(
      `/products/${productId}/variants/${variantId}`,
      data,
    ),
  deleteVariant: (productId: string, variantId: string) =>
    api.delete<ProductVariant>(`/products/${productId}/variants/${variantId}`),

  // Images
  addImage: (
    productId: string,
    data: { url: string; altText?: string; position?: number },
  ) => api.post<ProductImage>(`/products/${productId}/images`, data),
  updateImage: (
    productId: string,
    imageId: string,
    data: { url?: string; altText?: string; position?: number },
  ) =>
    api.patch<ProductImage>(`/products/${productId}/images/${imageId}`, data),
  deleteImage: (productId: string, imageId: string) =>
    api.delete<ProductImage>(`/products/${productId}/images/${imageId}`),
}
