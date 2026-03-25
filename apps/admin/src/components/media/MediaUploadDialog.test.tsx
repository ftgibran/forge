import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '@/test/test-utils'

import { MediaUploadDialog } from './MediaUploadDialog'

vi.mock('@/components/MediaUpload', () => ({
  MediaUpload: ({ onChange }: { onChange: (m: unknown) => void }) => (
    <button onClick={() => onChange({ id: 'new-media' })}>
      upload-trigger
    </button>
  ),
}))

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  onSaved: vi.fn(),
}

describe('MediaUploadDialog', () => {
  it('shows uploadMedia title', () => {
    render(<MediaUploadDialog {...baseProps} />)
    expect(screen.getByRole('heading')).toHaveTextContent('uploadMedia')
  })

  it('calls onSaved when media is uploaded', async () => {
    const onSaved = vi.fn()

    render(<MediaUploadDialog {...baseProps} onSaved={onSaved} />)
    await userEvent.click(
      screen.getByRole('button', { name: 'upload-trigger' }),
    )
    expect(onSaved).toHaveBeenCalledOnce()
  })

  it('calls onOpenChange(false) when cancel is clicked', async () => {
    const onOpenChange = vi.fn()

    render(<MediaUploadDialog {...baseProps} onOpenChange={onOpenChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not render when closed', () => {
    render(<MediaUploadDialog {...baseProps} open={false} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
