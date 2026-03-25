import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { ProductImagesDialog } from './ProductImagesDialog'

vi.mock('@/components/MediaUpload', () => ({
  MediaUpload: () => <div data-testid={'media-upload'}>media-upload-stub</div>,
}))

const { mockAddMutate, mockDeleteMutate, mockRefetch, stableProductData } =
  vi.hoisted(() => ({
    mockAddMutate: vi.fn(),
    mockDeleteMutate: vi.fn(),
    mockRefetch: vi.fn(),
    stableProductData: {
      images: [
        {
          id: 'img1',
          altText: 'Widget image',
          position: 0,
          media: { url: 'https://example.com/img.jpg', sizes: null },
        },
      ],
    },
  }))

vi.mock('@app/sdk', () => ({
  useGetProduct: vi.fn(() => ({
    data: stableProductData,
    refetch: mockRefetch,
  })),
  useAddProductImage: vi.fn(() => ({
    mutate: mockAddMutate,
    isPending: false,
  })),
  useDeleteProductImage: vi.fn(() => ({
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

describe('ProductImagesDialog', () => {
  it('renders dialog title with product name', () => {
    render(<ProductImagesDialog {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('imagesFor')
  })

  it('renders existing image alt text and position', () => {
    render(<ProductImagesDialog {...baseProps} />)
    expect(screen.getByText('Widget image')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('shows add image form when Add Image button clicked', async () => {
    render(<ProductImagesDialog {...baseProps} />)
    await userEvent.click(screen.getByRole('button', { name: /addImage/ }))
    expect(screen.getByTestId('media-upload')).toBeInTheDocument()
  })

  it('calls deleteImage.mutate when delete button clicked', async () => {
    render(<ProductImagesDialog {...baseProps} />)
    await userEvent.click(screen.getByRole('button', { name: 'delete' }))
    expect(mockDeleteMutate).toHaveBeenCalledWith(
      { id: 'prod1', imageId: 'img1' },
      expect.anything(),
    )
  })

  it('does not render when closed', () => {
    render(<ProductImagesDialog {...baseProps} open={false} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
