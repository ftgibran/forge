import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { UserFormDialog } from './UserFormDialog'

const mockCreateMutate = vi.fn()
const mockUpdateMutate = vi.fn()

vi.mock('@app/sdk', () => ({
  useCreateUser: vi.fn(() => ({ mutate: mockCreateMutate, isPending: false })),
  useUpdateUser: vi.fn(() => ({ mutate: mockUpdateMutate, isPending: false })),
}))

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  user: null,
  onSaved: vi.fn(),
}

const mockUser = {
  id: '1',
  name: 'Alice',
  email: 'alice@test.com',
  createdAt: '2024-06-15T12:00:00Z',
  updatedAt: '2024-06-15T12:00:00Z',
}

describe('UserFormDialog', () => {
  it('shows createUser title in create mode', () => {
    render(<UserFormDialog {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('createUser')
  })

  it('shows editUser title in edit mode', () => {
    render(<UserFormDialog {...baseProps} user={mockUser} />)
    expect(screen.getByRole('heading')).toHaveTextContent('editUser')
  })

  it('pre-fills name and email in edit mode', () => {
    render(<UserFormDialog {...baseProps} user={mockUser} />)
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument()
    expect(screen.getByDisplayValue('alice@test.com')).toBeInTheDocument()
  })

  it('calls createUser.mutate on submit in create mode', async () => {
    render(<UserFormDialog {...baseProps} />)
    await userEvent.type(screen.getAllByRole('textbox')[0], 'Bob')
    await userEvent.type(screen.getAllByRole('textbox')[1], 'bob@test.com')
    // password input is type=password, not textbox
    const inputs = document.querySelectorAll('input')

    await userEvent.type(inputs[2], 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'create' }))
    expect(mockCreateMutate).toHaveBeenCalled()
  })

  it('calls onOpenChange(false) when cancel is clicked', async () => {
    const onOpenChange = vi.fn()

    render(<UserFormDialog {...baseProps} onOpenChange={onOpenChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not render content when closed', () => {
    render(<UserFormDialog {...baseProps} open={false} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
