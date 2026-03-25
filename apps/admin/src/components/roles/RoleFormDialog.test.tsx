import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { RoleFormDialog } from './RoleFormDialog'

const mockCreateMutate = vi.fn()
const mockUpdateMutate = vi.fn()

vi.mock('@app/sdk', () => ({
  useCreateRole: vi.fn(() => ({ mutate: mockCreateMutate, isPending: false })),
  useUpdateRole: vi.fn(() => ({ mutate: mockUpdateMutate, isPending: false })),
}))

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  role: null,
  onSaved: vi.fn(),
}

const mockRole = {
  id: 'r1',
  name: 'Admin',
  description: 'Admin role',
  createdAt: '2024-06-15T12:00:00Z',
  updatedAt: '2024-06-15T12:00:00Z',
}

describe('RoleFormDialog', () => {
  it('shows createRole title in create mode', () => {
    render(<RoleFormDialog {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('createRole')
  })

  it('shows editRole title in edit mode', () => {
    render(<RoleFormDialog {...baseProps} role={mockRole} />)
    expect(screen.getByRole('heading')).toHaveTextContent('editRole')
  })

  it('pre-fills name in edit mode', () => {
    render(<RoleFormDialog {...baseProps} role={mockRole} />)
    expect(screen.getByDisplayValue('Admin')).toBeInTheDocument()
  })

  it('calls createRole.mutate on submit in create mode', async () => {
    render(<RoleFormDialog {...baseProps} />)
    // First textbox is the name input; textarea is description
    await userEvent.type(screen.getAllByRole('textbox')[0], 'NewRole')
    await userEvent.click(screen.getByRole('button', { name: 'create' }))
    expect(mockCreateMutate).toHaveBeenCalled()
  })

  it('calls onOpenChange(false) when cancel is clicked', async () => {
    const onOpenChange = vi.fn()

    render(<RoleFormDialog {...baseProps} onOpenChange={onOpenChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not render when closed', () => {
    render(<RoleFormDialog {...baseProps} open={false} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
