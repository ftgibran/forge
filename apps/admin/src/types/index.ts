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
