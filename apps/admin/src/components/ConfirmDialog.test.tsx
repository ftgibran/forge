import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders title and description when open', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title={'Delete User'}
        description={'Are you sure you want to delete?'}
        onConfirm={vi.fn()}
      />,
    )
    expect(screen.getByText('Delete User')).toBeInTheDocument()
    expect(
      screen.getByText('Are you sure you want to delete?'),
    ).toBeInTheDocument()
  })

  it('does not render content when closed', () => {
    render(
      <ConfirmDialog
        open={false}
        onOpenChange={vi.fn()}
        title={'Delete User'}
        description={'Are you sure?'}
        onConfirm={vi.fn()}
      />,
    )
    expect(screen.queryByText('Delete User')).not.toBeInTheDocument()
  })

  it('calls onConfirm when delete button is clicked', async () => {
    const onConfirm = vi.fn()

    render(
      <ConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        title={'Delete User'}
        description={'Confirm delete'}
        onConfirm={onConfirm}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'delete' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onOpenChange(false) when cancel is clicked', async () => {
    const onOpenChange = vi.fn()

    render(
      <ConfirmDialog
        open={true}
        onOpenChange={onOpenChange}
        title={'Delete'}
        description={'Confirm'}
        onConfirm={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
