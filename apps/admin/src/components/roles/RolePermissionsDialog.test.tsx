import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { RolePermissionsDialog } from './RolePermissionsDialog'

const { mockAssignMutate, mockRemoveMutate, stablePermsData, stableRoleData } =
  vi.hoisted(() => ({
    mockAssignMutate: vi.fn(),
    mockRemoveMutate: vi.fn(),
    stablePermsData: {
      items: [
        { id: 'p1', action: 'read', resource: 'users' },
        { id: 'p2', action: 'write', resource: 'products' },
      ],
    },
    stableRoleData: {
      rolePermissions: [
        { permission: { id: 'p1', action: 'read', resource: 'users' } },
      ],
    },
  }))

vi.mock('@app/sdk', () => ({
  useGetPermissions: vi.fn(() => ({ data: stablePermsData, isLoading: false })),
  useGetRole: vi.fn(() => ({ data: stableRoleData })),
  useAssignRolePermission: vi.fn(() => ({
    mutate: mockAssignMutate,
    isPending: false,
  })),
  useRemoveRolePermission: vi.fn(() => ({
    mutate: mockRemoveMutate,
    isPending: false,
  })),
}))

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  role: {
    id: 'r1',
    name: 'Admin',
    createdAt: '2024-06-15T12:00:00Z',
    updatedAt: '2024-06-15T12:00:00Z',
  },
  onSaved: vi.fn(),
}

describe('RolePermissionsDialog', () => {
  it('renders dialog title with role name', () => {
    render(<RolePermissionsDialog {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('permissionsFor')
  })

  it('renders all available permissions', () => {
    render(<RolePermissionsDialog {...baseProps} />)
    expect(screen.getByText('read:users')).toBeInTheDocument()
    expect(screen.getByText('write:products')).toBeInTheDocument()
  })

  it('calls removePermission.mutate for assigned permission', async () => {
    render(<RolePermissionsDialog {...baseProps} />)
    const removeButton = screen.getAllByRole('button', { name: 'remove' })[0]

    await userEvent.click(removeButton)
    expect(mockRemoveMutate).toHaveBeenCalledWith(
      { id: 'r1', permissionId: 'p1' },
      expect.anything(),
    )
  })

  it('calls assignPermission.mutate for unassigned permission', async () => {
    render(<RolePermissionsDialog {...baseProps} />)
    const assignButton = screen.getByRole('button', { name: 'assign' })

    await userEvent.click(assignButton)
    expect(mockAssignMutate).toHaveBeenCalledWith(
      { id: 'r1', data: { permissionId: 'p2' } },
      expect.anything(),
    )
  })

  it('does not render when closed', () => {
    render(<RolePermissionsDialog {...baseProps} open={false} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
