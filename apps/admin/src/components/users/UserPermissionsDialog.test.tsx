import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { UserPermissionsDialog } from './UserPermissionsDialog'

const { mockAssignMutate, mockRemoveMutate, stablePermsData, stableUserData } =
  vi.hoisted(() => ({
    mockAssignMutate: vi.fn(),
    mockRemoveMutate: vi.fn(),
    stablePermsData: {
      items: [
        { id: 'p1', action: 'read', resource: 'users' },
        { id: 'p2', action: 'write', resource: 'products' },
      ],
    },
    stableUserData: {
      userPermissions: [
        { permission: { id: 'p1', action: 'read', resource: 'users' } },
      ],
    },
  }))

vi.mock('@app/sdk', () => ({
  useGetPermissions: vi.fn(() => ({ data: stablePermsData, isLoading: false })),
  useGetUser: vi.fn(() => ({ data: stableUserData })),
  useAssignUserPermission: vi.fn(() => ({
    mutate: mockAssignMutate,
    isPending: false,
  })),
  useRemoveUserPermission: vi.fn(() => ({
    mutate: mockRemoveMutate,
    isPending: false,
  })),
}))

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  user: {
    id: 'u1',
    name: 'Alice',
    email: 'alice@test.com',
    createdAt: '2024-06-15T12:00:00Z',
    updatedAt: '2024-06-15T12:00:00Z',
  },
  onSaved: vi.fn(),
}

describe('UserPermissionsDialog', () => {
  it('renders dialog title', () => {
    render(<UserPermissionsDialog {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('directPermissions')
  })

  it('renders all available permissions', () => {
    render(<UserPermissionsDialog {...baseProps} />)
    expect(screen.getByText('read:users')).toBeInTheDocument()
    expect(screen.getByText('write:products')).toBeInTheDocument()
  })

  it('calls removePermission.mutate for assigned permission', async () => {
    render(<UserPermissionsDialog {...baseProps} />)
    const removeButton = screen.getAllByRole('button', { name: 'remove' })[0]

    await userEvent.click(removeButton)
    expect(mockRemoveMutate).toHaveBeenCalledWith(
      { id: 'u1', permissionId: 'p1' },
      expect.anything(),
    )
  })

  it('calls assignPermission.mutate for unassigned permission', async () => {
    render(<UserPermissionsDialog {...baseProps} />)
    const assignButton = screen.getByRole('button', { name: 'assign' })

    await userEvent.click(assignButton)
    expect(mockAssignMutate).toHaveBeenCalledWith(
      { id: 'u1', data: { permissionId: 'p2' } },
      expect.anything(),
    )
  })

  it('does not render when closed', () => {
    render(<UserPermissionsDialog {...baseProps} open={false} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
