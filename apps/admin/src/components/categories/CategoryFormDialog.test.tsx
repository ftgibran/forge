import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { CategoryFormDialog } from './CategoryFormDialog'

const mockCreateMutate = vi.fn()
const mockUpdateMutate = vi.fn()

vi.mock('@app/sdk', () => ({
  useCreateCategory: vi.fn(() => ({
    mutate: mockCreateMutate,
    isPending: false,
  })),
  useUpdateCategory: vi.fn(() => ({
    mutate: mockUpdateMutate,
    isPending: false,
  })),
}))

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  category: null,
  categories: [],
  onSaved: vi.fn(),
}

const mockCategory = {
  id: 'c1',
  name: 'Electronics',
  slug: 'electronics',
  description: 'Electronic products',
  parentId: null,
  createdAt: '2024-06-15T12:00:00Z',
  updatedAt: '2024-06-15T12:00:00Z',
}

describe('CategoryFormDialog', () => {
  it('shows createCategory title in create mode', () => {
    render(<CategoryFormDialog {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('createCategory')
  })

  it('shows editCategory title in edit mode', () => {
    render(<CategoryFormDialog {...baseProps} category={mockCategory} />)
    expect(screen.getByRole('heading')).toHaveTextContent('editCategory')
  })

  it('pre-fills name and slug in edit mode', () => {
    render(<CategoryFormDialog {...baseProps} category={mockCategory} />)
    expect(screen.getByDisplayValue('Electronics')).toBeInTheDocument()
    expect(screen.getByDisplayValue('electronics')).toBeInTheDocument()
  })

  it('calls createCategory.mutate on submit in create mode', async () => {
    render(<CategoryFormDialog {...baseProps} />)
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], 'Toys')
    await userEvent.type(inputs[1], 'toys')
    await userEvent.click(screen.getByRole('button', { name: 'create' }))
    expect(mockCreateMutate).toHaveBeenCalled()
  })

  it('calls onOpenChange(false) when cancel is clicked', async () => {
    const onOpenChange = vi.fn()

    render(<CategoryFormDialog {...baseProps} onOpenChange={onOpenChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not render when closed', () => {
    render(<CategoryFormDialog {...baseProps} open={false} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
