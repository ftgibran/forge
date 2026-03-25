import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { ProductVariantsDialog } from './ProductVariantsDialog'

const { mockAddMutate, mockDeleteMutate, mockRefetch, stableProductData } =
  vi.hoisted(() => ({
    mockAddMutate: vi.fn(),
    mockDeleteMutate: vi.fn(),
    mockRefetch: vi.fn(),
    stableProductData: {
      variants: [
        {
          id: 'v1',
          name: 'Large',
          sku: 'W-L',
          price: '29.99',
          compareAtPrice: null,
          stock: 10,
        },
      ],
    },
  }))

vi.mock('@app/sdk', () => ({
  useGetProduct: vi.fn(() => ({
    data: stableProductData,
    refetch: mockRefetch,
  })),
  useAddProductVariant: vi.fn(() => ({
    mutate: mockAddMutate,
    isPending: false,
  })),
  useDeleteProductVariant: vi.fn(() => ({
    mutate: mockDeleteMutate,
    isPending: false,
  })),
}))

const mockProduct = {
  id: 'prod1',
  name: 'Widget',
  slug: 'widget',
  vendorId: 'v1',
  status: 'ACTIVE',
  createdAt: '2024-06-15T12:00:00Z',
  updatedAt: '2024-06-15T12:00:00Z',
}

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  product: mockProduct,
  onSaved: vi.fn(),
}

describe('ProductVariantsDialog', () => {
  it('renders dialog title with product name', () => {
    render(<ProductVariantsDialog {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('variantsFor')
  })

  it('renders existing variants', () => {
    render(<ProductVariantsDialog {...baseProps} />)
    expect(screen.getByText('Large')).toBeInTheDocument()
    expect(screen.getByText('W-L')).toBeInTheDocument()
  })

  it('shows add variant form when Add Variant button clicked', async () => {
    render(<ProductVariantsDialog {...baseProps} />)
    await userEvent.click(screen.getByRole('button', { name: /addVariant/ }))
    // form should now show with name input
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0)
  })

  it('calls deleteVariant.mutate when delete button clicked', async () => {
    render(<ProductVariantsDialog {...baseProps} />)
    await userEvent.click(screen.getByRole('button', { name: 'delete' }))
    expect(mockDeleteMutate).toHaveBeenCalledWith(
      { id: 'prod1', variantId: 'v1' },
      expect.anything(),
    )
  })

  it('does not render when closed', () => {
    render(<ProductVariantsDialog {...baseProps} open={false} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
