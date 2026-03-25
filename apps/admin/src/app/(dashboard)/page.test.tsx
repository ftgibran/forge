import { useGetUsers } from '@app/sdk'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import DashboardPage from './page'

vi.mock('@/components/StatCard', () => ({
  StatCard: ({ label, value }: { label: string; value: number }) => (
    <div data-testid={`stat-${label}`}>{value}</div>
  ),
}))

vi.mock('@/components/TableSkeleton', () => ({
  TableSkeleton: () => <div data-testid={'table-skeleton'} />,
}))

vi.mock('@/components/PageHeader', () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}))

const { stableUsersData } = vi.hoisted(() => ({
  stableUsersData: {
    items: [
      {
        id: 'u1',
        name: 'Alice',
        email: 'alice@test.com',
        createdAt: '2024-06-15T12:00:00Z',
        userRoles: [],
      },
      {
        id: 'u2',
        name: 'Bob',
        email: 'bob@test.com',
        createdAt: '2024-06-15T12:00:00Z',
        userRoles: [],
      },
    ],
    total: 2,
  },
}))

vi.mock('@app/sdk', () => ({
  useGetUsers: vi.fn(() => ({ data: stableUsersData, isLoading: false })),
  useGetRoles: vi.fn(() => ({ data: { total: 3 } })),
  useGetPermissions: vi.fn(() => ({ data: { total: 5 } })),
  useGetVendors: vi.fn(() => ({ data: { total: 2 } })),
  useGetProducts: vi.fn(() => ({ data: { total: 10 } })),
  useGetOrders: vi.fn(() => ({ data: { total: 7 } })),
}))

describe('DashboardPage', () => {
  it('renders dashboard title', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('heading')).toHaveTextContent('title')
  })

  it('renders stat cards with correct values', () => {
    render(<DashboardPage />)
    // StatCard stub renders value as text content in data-testid element
    expect(screen.getByTestId('stat-users')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-roles')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-permissions')).toHaveTextContent('5')
  })

  it('renders recent users table with user data', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('bob@test.com')).toBeInTheDocument()
  })

  it('renders skeleton when loading', () => {
    vi.mocked(useGetUsers).mockReturnValueOnce({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useGetUsers>)
    render(<DashboardPage />)
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument()
  })
})
