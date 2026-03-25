import { useGetUsers } from '@app/sdk'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import UsersPage from './page'

// Stub all dialog sub-components — they have their own tests
vi.mock('@/components/users/UserFormDialog', () => ({
  UserFormDialog: ({ open }: { open: boolean }) =>
    open ? <div data-testid={'user-form-dialog'} /> : null,
}))
vi.mock('@/components/users/UserRolesDialog', () => ({
  UserRolesDialog: () => null,
}))
vi.mock('@/components/users/UserPermissionsDialog', () => ({
  UserPermissionsDialog: () => null,
}))
vi.mock('@/components/TableSkeleton', () => ({
  TableSkeleton: () => <div data-testid={'table-skeleton'} />,
}))

const { mockDeleteMutate, stableUsersData } = vi.hoisted(() => ({
  mockDeleteMutate: vi.fn(),
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
  useDeleteUser: vi.fn(() => ({ mutate: mockDeleteMutate, isPending: false })),
}))

describe('UsersPage', () => {
  it('renders page title', () => {
    render(<UsersPage />)
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('renders user table rows', () => {
    render(<UsersPage />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('bob@test.com')).toBeInTheDocument()
  })

  it('shows loading skeleton when data is loading', () => {
    vi.mocked(useGetUsers).mockReturnValueOnce({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useGetUsers>)
    render(<UsersPage />)
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument()
  })

  it('opens create dialog when Create User button clicked', async () => {
    render(<UsersPage />)
    await userEvent.click(screen.getByRole('button', { name: 'createUser' }))
    expect(screen.getByTestId('user-form-dialog')).toBeInTheDocument()
  })

  it('opens delete dialog when delete button clicked', async () => {
    render(<UsersPage />)
    // Multiple delete buttons — click the first one
    const deleteButtons = screen.getAllByRole('button', { name: 'delete' })

    await userEvent.click(deleteButtons[0])
    // ConfirmDialog renders when open=true
    expect(screen.getByText('deleteUser')).toBeInTheDocument()
  })
})
