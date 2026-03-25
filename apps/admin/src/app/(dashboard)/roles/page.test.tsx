import { useGetRoles } from '@app/sdk'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import RolesPage from './page'

vi.mock('@/components/roles/RoleFormDialog', () => ({
  RoleFormDialog: ({ open }: { open: boolean }) =>
    open ? <div data-testid={'role-form-dialog'} /> : null,
}))
vi.mock('@/components/roles/RolePermissionsDialog', () => ({
  RolePermissionsDialog: () => null,
}))
vi.mock('@/components/TableSkeleton', () => ({
  TableSkeleton: () => <div data-testid={'table-skeleton'} />,
}))

const { mockDeleteMutate, stableRolesData } = vi.hoisted(() => ({
  mockDeleteMutate: vi.fn(),
  stableRolesData: {
    items: [
      {
        id: 'r1',
        name: 'Admin',
        description: 'Admin role',
        createdAt: '2024-06-15T12:00:00Z',
        rolePermissions: [],
      },
      {
        id: 'r2',
        name: 'Editor',
        description: null,
        createdAt: '2024-06-15T12:00:00Z',
        rolePermissions: [],
      },
    ],
    total: 2,
  },
}))

vi.mock('@app/sdk', () => ({
  useGetRoles: vi.fn(() => ({ data: stableRolesData, isLoading: false })),
  useDeleteRole: vi.fn(() => ({ mutate: mockDeleteMutate, isPending: false })),
}))

describe('RolesPage', () => {
  it('renders page title', () => {
    render(<RolesPage />)
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('renders role rows in table', () => {
    render(<RolesPage />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Editor')).toBeInTheDocument()
  })

  it('shows loading skeleton when loading', () => {
    vi.mocked(useGetRoles).mockReturnValueOnce({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useGetRoles>)
    render(<RolesPage />)
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument()
  })

  it('opens create dialog when Create Role button clicked', async () => {
    render(<RolesPage />)
    await userEvent.click(screen.getByRole('button', { name: 'createRole' }))
    expect(screen.getByTestId('role-form-dialog')).toBeInTheDocument()
  })

  it('opens delete dialog when delete button clicked', async () => {
    render(<RolesPage />)
    const deleteButtons = screen.getAllByRole('button', { name: 'delete' })

    await userEvent.click(deleteButtons[0])
    expect(screen.getByText('deleteRole')).toBeInTheDocument()
  })
})
