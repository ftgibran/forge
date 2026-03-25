import { useGetMediaList } from '@app/sdk'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import MediaPage from './page'

vi.mock('@/components/media/MediaUploadDialog', () => ({
  MediaUploadDialog: ({ open }: { open: boolean }) =>
    open ? <div data-testid={'upload-dialog'} /> : null,
}))
vi.mock('@/components/media/MediaEditDialog', () => ({
  MediaEditDialog: () => null,
}))
vi.mock('@/components/TableSkeleton', () => ({
  TableSkeleton: () => <div data-testid={'table-skeleton'} />,
}))

const { mockDeleteMutate, stableMediaData } = vi.hoisted(() => ({
  mockDeleteMutate: vi.fn(),
  stableMediaData: {
    items: [
      {
        id: 1,
        url: 'https://example.com/img.jpg',
        alt: 'An image',
        filename: 'img.jpg',
        mimeType: 'image/jpeg',
        filesize: 2048,
        width: 800,
        height: 600,
        sizes: null,
        createdAt: '2024-06-15T12:00:00Z',
        updatedAt: '2024-06-15T12:00:00Z',
      },
    ],
    total: 1,
  },
}))

vi.mock('@app/sdk', () => ({
  useGetMediaList: vi.fn(() => ({ data: stableMediaData, isLoading: false })),
  useDeleteMedia: vi.fn(() => ({ mutate: mockDeleteMutate, isPending: false })),
}))

describe('MediaPage', () => {
  it('renders page title', () => {
    render(<MediaPage />)
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('renders media items in table', () => {
    render(<MediaPage />)
    // The filename column renders in the DataTable
    expect(screen.getByText('img.jpg')).toBeInTheDocument()
  })

  it('shows loading skeleton when loading', () => {
    vi.mocked(useGetMediaList).mockReturnValueOnce({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useGetMediaList>)
    render(<MediaPage />)
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument()
  })

  it('opens upload dialog when Upload button clicked', async () => {
    render(<MediaPage />)
    await userEvent.click(screen.getByRole('button', { name: 'uploadMedia' }))
    expect(screen.getByTestId('upload-dialog')).toBeInTheDocument()
  })

  it('opens delete confirm when delete button clicked', async () => {
    render(<MediaPage />)
    const deleteButton = screen.getByRole('button', { name: 'delete' })

    await userEvent.click(deleteButton)
    expect(screen.getByText('deleteMedia')).toBeInTheDocument()
  })
})
