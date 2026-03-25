import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { PermissionFormDialog } from './PermissionFormDialog'

const mockCreateMutate = vi.fn()
const mockUpdateMutate = vi.fn()

vi.mock('@app/sdk', () => ({
  useCreatePermission: vi.fn(() => ({
    mutate: mockCreateMutate,
    isPending: false,
  })),
  useUpdatePermission: vi.fn(() => ({
    mutate: mockUpdateMutate,
    isPending: false,
  })),
}))

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  permission: null,
  onSaved: vi.fn(),
}

const mockPermission = {
  id: 'p1',
  action: 'read',
  resource: 'users',
  description: 'Read users',
  createdAt: '2024-06-15T12:00:00Z',
  updatedAt: '2024-06-15T12:00:00Z',
}

describe('PermissionFormDialog', () => {
  it('shows createPermission title in create mode', () => {
    render(<PermissionFormDialog {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('createPermission')
  })

  it('shows editPermission title in edit mode', () => {
    render(<PermissionFormDialog {...baseProps} permission={mockPermission} />)
    expect(screen.getByRole('heading')).toHaveTextContent('editPermission')
  })

  it('pre-fills action and resource in edit mode', () => {
    render(<PermissionFormDialog {...baseProps} permission={mockPermission} />)
    expect(screen.getByDisplayValue('read')).toBeInTheDocument()
    expect(screen.getByDisplayValue('users')).toBeInTheDocument()
  })

  it('calls createPermission.mutate on submit in create mode', async () => {
    render(<PermissionFormDialog {...baseProps} />)
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], 'create')
    await userEvent.type(inputs[1], 'products')
    await userEvent.click(screen.getByRole('button', { name: 'create' }))
    expect(mockCreateMutate).toHaveBeenCalled()
  })

  it('calls onOpenChange(false) when cancel is clicked', async () => {
    const onOpenChange = vi.fn()

    render(<PermissionFormDialog {...baseProps} onOpenChange={onOpenChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not render when closed', () => {
    render(<PermissionFormDialog {...baseProps} open={false} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
