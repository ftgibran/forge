import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { MediaEditDialog } from './MediaEditDialog'

const mockUpdateMutate = vi.fn()

vi.mock('@app/sdk', () => ({
  useUpdateMedia: vi.fn(() => ({ mutate: mockUpdateMutate, isPending: false })),
}))

const mockMedia = {
  id: 1,
  url: 'https://example.com/image.jpg',
  alt: 'An image',
  mimeType: 'image/jpeg',
  filesize: 1024,
  width: 800,
  height: 600,
  sizes: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  media: mockMedia,
  onSaved: vi.fn(),
}

describe('MediaEditDialog', () => {
  it('shows editMedia title', () => {
    render(<MediaEditDialog {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('editMedia')
  })

  it('pre-fills alt text from media', () => {
    render(<MediaEditDialog {...baseProps} />)
    expect(screen.getByDisplayValue('An image')).toBeInTheDocument()
  })

  it('calls updateMedia.mutate on submit', async () => {
    render(<MediaEditDialog {...baseProps} />)
    await userEvent.click(screen.getByRole('button', { name: 'save' }))
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      { id: 1, data: { alt: 'An image' } },
      expect.anything(),
    )
  })

  it('calls onOpenChange(false) when cancel is clicked', async () => {
    const onOpenChange = vi.fn()

    render(<MediaEditDialog {...baseProps} onOpenChange={onOpenChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not render when closed', () => {
    render(<MediaEditDialog {...baseProps} open={false} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
