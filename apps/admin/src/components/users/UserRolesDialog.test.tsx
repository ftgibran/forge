import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { UserRolesDialog } from './UserRolesDialog'

// vi.hoisted creates variables accessible in the hoisted vi.mock factory
const { mockAssignMutate, mockRemoveMutate, stableRolesData, stableUserData } =
  vi.hoisted(() => ({
    mockAssignMutate: vi.fn(),
    mockRemoveMutate: vi.fn(),
    // Stable object references prevent infinite useEffect re-runs (freshUser dependency)
    stableRolesData: {
      items: [
        { id: 'r1', name: 'Admin' },
        { id: 'r2', name: 'Editor' },
      ],
    },
    stableUserData: { userRoles: [{ role: { id: 'r1', name: 'Admin' } }] },
  }))

vi.mock('@app/sdk', () => ({
  useGetRoles: vi.fn(() => ({ data: stableRolesData, isLoading: false })),
  useGetUser: vi.fn(() => ({ data: stableUserData })),
  useAssignUserRole: vi.fn(() => ({
    mutate: mockAssignMutate,
    isPending: false,
  })),
  useRemoveUserRole: vi.fn(() => ({
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

describe('UserRolesDialog', () => {
  it('renders dialog title with user name', () => {
    render(<UserRolesDialog {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('manageRoles')
  })

  it('renders all available roles', () => {
    render(<UserRolesDialog {...baseProps} />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Editor')).toBeInTheDocument()
  })

  it('calls removeRole.mutate when removing an assigned role', async () => {
    render(<UserRolesDialog {...baseProps} />)
    // Admin is assigned, so first button should be "remove"
    const removeButton = screen.getAllByRole('button', { name: 'remove' })[0]

    await userEvent.click(removeButton)
    expect(mockRemoveMutate).toHaveBeenCalledWith(
      { id: 'u1', roleId: 'r1' },
      expect.anything(),
    )
  })

  it('calls assignRole.mutate when assigning an unassigned role', async () => {
    render(<UserRolesDialog {...baseProps} />)
    // Editor is not assigned, button should be "assign"
    const assignButton = screen.getByRole('button', { name: 'assign' })

    await userEvent.click(assignButton)
    expect(mockAssignMutate).toHaveBeenCalledWith(
      { id: 'u1', data: { roleId: 'r2' } },
      expect.anything(),
    )
  })

  it('does not render when closed', () => {
    render(<UserRolesDialog {...baseProps} open={false} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
