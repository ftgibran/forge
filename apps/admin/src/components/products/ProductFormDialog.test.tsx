import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { ProductFormDialog } from './ProductFormDialog'

const mockCreateMutate = vi.fn()
const mockUpdateMutate = vi.fn()

vi.mock('@app/sdk', () => ({
  useCreateProduct: vi.fn(() => ({
    mutate: mockCreateMutate,
    isPending: false,
  })),
  useUpdateProduct: vi.fn(() => ({
    mutate: mockUpdateMutate,
    isPending: false,
  })),
}))

const mockVendor = {
  id: 'v1',
  name: 'Vendor Co',
  slug: 'vendor-co',
  ownerId: 'u1',
  status: 'ACTIVE',
  createdAt: '2024-06-15T12:00:00Z',
  updatedAt: '2024-06-15T12:00:00Z',
}
const mockCategory = {
  id: 'c1',
  name: 'Electronics',
  slug: 'electronics',
  children: [],
  createdAt: '2024-06-15T12:00:00Z',
  updatedAt: '2024-06-15T12:00:00Z',
}
const mockProduct = {
  id: 'prod1',
  name: 'Widget',
  slug: 'widget',
  description: 'A widget',
  vendorId: 'v1',
  categoryId: 'c1',
  status: 'ACTIVE',
  filamentType: 'PLA',
  printTimeHours: 2,
  dimensionX: 10,
  dimensionY: 10,
  dimensionZ: 10,
  fileFormat: 'STL',
  nozzleSize: 0.4,
  infillPercentage: 20,
  supportsRequired: false,
  createdAt: '2024-06-15T12:00:00Z',
  updatedAt: '2024-06-15T12:00:00Z',
}

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  product: null,
  categories: [mockCategory],
  vendors: [mockVendor],
  onSaved: vi.fn(),
}

describe('ProductFormDialog', () => {
  it('shows createProduct title in create mode', () => {
    render(<ProductFormDialog {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('createProduct')
  })

  it('shows editProduct title in edit mode', () => {
    render(<ProductFormDialog {...baseProps} product={mockProduct} />)
    expect(screen.getByRole('heading')).toHaveTextContent('editProduct')
  })

  it('pre-fills name and slug in edit mode', () => {
    render(<ProductFormDialog {...baseProps} product={mockProduct} />)
    expect(screen.getByDisplayValue('Widget')).toBeInTheDocument()
    expect(screen.getByDisplayValue('widget')).toBeInTheDocument()
  })

  it('calls createProduct.mutate on submit in create mode', async () => {
    render(<ProductFormDialog {...baseProps} />)
    const inputs = screen.getAllByRole('textbox')

    await userEvent.type(inputs[0], 'New Product')
    await userEvent.type(inputs[1], 'new-product')
    await userEvent.click(screen.getByRole('button', { name: 'create' }))
    expect(mockCreateMutate).toHaveBeenCalled()
  })

  it('calls onOpenChange(false) when cancel is clicked', async () => {
    const onOpenChange = vi.fn()

    render(<ProductFormDialog {...baseProps} onOpenChange={onOpenChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not render when closed', () => {
    render(<ProductFormDialog {...baseProps} open={false} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
