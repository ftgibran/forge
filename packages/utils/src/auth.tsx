'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: string
  email: string
  name: string
  roles: string[]
  iat: number
  exp: number
}

export interface AuthUser {
  id: string
  email: string
  name: string
  createdAt?: string
  updatedAt?: string
  userRoles?: { role: { id: string; name: string }; assignedAt: string }[]
  userPermissions?: {
    permission: { id: string; action: string; resource: string }
    assignedAt: string
  }[]
}

interface AuthResponse {
  accessToken: string
  user: AuthUser
}

interface AuthContextValue {
  user: AuthUser | null
  tokenPayload: JwtPayload | null
  isLoading: boolean
  getToken: () => string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

// ─── JWT decode ───────────────────────────────────────────────────────────────

function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

// ─── Internal fetch helpers ───────────────────────────────────────────────────

async function apiFetch<T>(
  apiUrl: string,
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${apiUrl}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body.message || `Request failed with status ${res.status}`
    const err = new Error(message) as Error & { status: number }
    err.status = res.status
    throw err
  }

  const json = await res.json()
  return json.data !== undefined ? (json.data as T) : (json as T)
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({
  apiUrl,
  children,
}: {
  apiUrl: string
  children: ReactNode
}) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [tokenPayload, setTokenPayload] = useState<JwtPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getToken = useCallback(
    () =>
      typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    [],
  )

  const applyAuth = useCallback((res: AuthResponse) => {
    localStorage.setItem('token', res.accessToken)
    setUser(res.user)
    setTokenPayload(decodeJwt(res.accessToken))
  }, [])

  useEffect(() => {
    const token = getToken()

    if (!token) {
      setIsLoading(false)
      return
    }

    apiFetch<AuthUser>(apiUrl, '/auth/me', {}, token)
      .then((u) => {
        setUser(u)
        setTokenPayload(decodeJwt(token))
      })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setIsLoading(false))
  }, [apiUrl, getToken])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiFetch<AuthResponse>(apiUrl, '/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      applyAuth(res)
    },
    [apiUrl, applyAuth],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await apiFetch<AuthResponse>(apiUrl, '/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
      applyAuth(res)
    },
    [apiUrl, applyAuth],
  )

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
    setTokenPayload(null)
    window.location.href = '/login'
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        tokenPayload,
        isLoading,
        getToken,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)

  if (!ctx) throw new Error('useAuth must be used within AuthProvider')

  return ctx
}
