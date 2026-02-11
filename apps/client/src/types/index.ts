export interface Permission {
  id: string
  action: string
  resource: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  rolePermissions?: { permission: Permission; assignedAt: string }[]
  userRoles?: { user: User; assignedAt: string }[]
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
  userRoles?: { role: Role; assignedAt: string }[]
  userPermissions?: { permission: Permission; assignedAt: string }[]
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface PaginatedList<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Vendor {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  ownerId: string
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED'
  createdAt: string
  updatedAt: string
  owner?: { id: string; email: string; name: string }
  _count?: { products: number }
}

export interface VendorApplication {
  id: string
  vendorId: string
  message: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewedById: string | null
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
  vendor?: Vendor
  reviewedBy?: { id: string; email: string; name: string } | null
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parentId: string | null
  createdAt: string
  updatedAt: string
  parent?: Category | null
  children?: Category[]
  _count?: { products: number }
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  compareAtPrice: number | null
  stock: number
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  altText: string | null
  position: number
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  vendorId: string
  categoryId: string | null
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  filamentType: string | null
  printTimeHours: number | null
  dimensionX: number | null
  dimensionY: number | null
  dimensionZ: number | null
  fileFormat: string | null
  nozzleSize: number | null
  infillPercentage: number | null
  supportsRequired: boolean | null
  createdAt: string
  updatedAt: string
  vendor?: { id: string; name: string; slug: string }
  category?: Category | null
  variants?: ProductVariant[]
  images?: ProductImage[]
  _count?: { reviews: number; variants: number }
  averageRating?: number
}

export interface OrderItem {
  id: string
  orderId: string
  variantId: string
  productId: string
  quantity: number
  unitPrice: number
  variant?: ProductVariant
  product?: { id: string; name: string; slug: string }
}

export interface Order {
  id: string
  userId: string
  vendorId: string
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
  totalAmount: number
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: string
  updatedAt: string
  user?: { id: string; email: string; name: string }
  vendor?: { id: string; name: string }
  items?: OrderItem[]
  _count?: { items: number }
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title: string | null
  comment: string | null
  createdAt: string
  updatedAt: string
  user?: { id: string; name: string }
  product?: { id: string; name: string; slug: string }
}

export interface CartItem {
  id: string
  cartId: string
  variantId: string
  quantity: number
  variant?: ProductVariant & { product?: Product }
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}
