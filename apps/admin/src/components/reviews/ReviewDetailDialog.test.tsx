import { useGetReview } from '@app/sdk'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { ReviewDetailDialog } from './ReviewDetailDialog'

const mockReview = {
  id: 'rev1',
  rating: 4,
  title: 'Great product',
  comment: 'Really enjoyed it',
  product: { name: 'Widget' },
  user: { name: 'Alice' },
}

vi.mock('@app/sdk', () => ({
  useGetReview: vi.fn(() => ({ data: mockReview, isError: false })),
}))

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  reviewId: 'rev1',
}

describe('ReviewDetailDialog', () => {
  it('renders reviewDetails title', () => {
    render(<ReviewDetailDialog {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('reviewDetails')
  })

  it('renders product and user names', () => {
    render(<ReviewDetailDialog {...baseProps} />)
    expect(screen.getByText(/Widget/)).toBeInTheDocument()
    expect(screen.getByText(/Alice/)).toBeInTheDocument()
  })

  it('renders review title and comment', () => {
    render(<ReviewDetailDialog {...baseProps} />)
    expect(screen.getByText(/Great product/)).toBeInTheDocument()
    expect(screen.getByText(/Really enjoyed it/)).toBeInTheDocument()
  })

  it('renders star rating', () => {
    render(<ReviewDetailDialog {...baseProps} />)
    expect(screen.getByText(/★★★★☆/)).toBeInTheDocument()
  })

  it('returns null when review is not loaded', () => {
    vi.mocked(useGetReview).mockReturnValueOnce({
      data: undefined,
      isError: false,
    } as never)
    const { container } = render(<ReviewDetailDialog {...baseProps} />)

    expect(container).toBeEmptyDOMElement()
  })
})
