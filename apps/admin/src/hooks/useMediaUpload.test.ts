import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useMediaUpload } from './useMediaUpload'

// Mock browser APIs unavailable in happy-dom
URL.createObjectURL = vi.fn(() => 'blob:test-url')
URL.revokeObjectURL = vi.fn()

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    drawImage: vi.fn(),
  })),
  configurable: true,
})

Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: vi.fn((cb: BlobCallback) =>
    cb(new Blob(['mock'], { type: 'image/jpeg' })),
  ),
  configurable: true,
})

const mockUploadMedia = vi
  .fn()
  .mockResolvedValue({ id: 'uploaded-id', url: 'https://example.com/img.jpg' })

vi.mock('@app/sdk', () => ({
  useUploadMedia: vi.fn(() => ({
    mutateAsync: mockUploadMedia,
    isPending: false,
  })),
}))

vi.mock('@app/theme', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()

  return {
    ...actual,
    toaster: { error: vi.fn(), success: vi.fn(), create: vi.fn() },
  }
})

function renderMediaUpload(onChange = vi.fn()) {
  return renderHook(() => useMediaUpload({ onChange }))
}

describe('useMediaUpload', () => {
  it('initializes with closed crop dialog and no srcUrl', () => {
    const { result } = renderMediaUpload()

    expect(result.current.cropOpen).toBe(false)
    expect(result.current.srcUrl).toBeNull()
  })

  it('handleFileAccept sets srcUrl and opens crop dialog', () => {
    const { result } = renderMediaUpload()
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

    act(() => {
      result.current.handleFileAccept({ files: [file] })
    })

    expect(URL.createObjectURL).toHaveBeenCalledWith(file)
    expect(result.current.srcUrl).toBe('blob:test-url')
    expect(result.current.cropOpen).toBe(true)
  })

  it('handleFileAccept does nothing when no files provided', () => {
    const { result } = renderMediaUpload()

    act(() => {
      result.current.handleFileAccept({ files: [] })
    })

    expect(result.current.srcUrl).toBeNull()
    expect(result.current.cropOpen).toBe(false)
  })

  it('handleClose revokes URL and closes crop dialog', () => {
    const { result } = renderMediaUpload()
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

    act(() => {
      result.current.handleFileAccept({ files: [file] })
    })

    act(() => {
      result.current.handleClose()
    })

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url')
    expect(result.current.srcUrl).toBeNull()
    expect(result.current.cropOpen).toBe(false)
  })

  it('handleClose is no-op when srcUrl is null', () => {
    const { result } = renderMediaUpload()

    act(() => {
      result.current.handleClose()
    })

    expect(result.current.cropOpen).toBe(false)
  })

  it('onImageLoad sets crop without aspect ratio', () => {
    const { result } = renderMediaUpload()
    const mockEvent = {
      currentTarget: { naturalWidth: 800, naturalHeight: 600 },
    } as React.SyntheticEvent<HTMLImageElement>

    act(() => {
      result.current.onImageLoad(mockEvent)
    })

    expect(result.current.crop).toBeDefined()
  })

  it('onImageLoad sets aspect-ratio crop when aspectRatio provided', () => {
    const { result } = renderHook(() =>
      useMediaUpload({ aspectRatio: 1, onChange: vi.fn() }),
    )
    const mockEvent = {
      currentTarget: { naturalWidth: 800, naturalHeight: 600 },
    } as React.SyntheticEvent<HTMLImageElement>

    act(() => {
      result.current.onImageLoad(mockEvent)
    })

    expect(result.current.crop).toBeDefined()
  })

  it('handleConfirmCrop is no-op when no completedCrop', async () => {
    const onChange = vi.fn()
    const { result } = renderMediaUpload(onChange)

    await act(async () => {
      await result.current.handleConfirmCrop()
    })

    expect(mockUploadMedia).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('handleConfirmCrop uploads and calls onChange when crop is set', async () => {
    const onChange = vi.fn()
    const { result } = renderMediaUpload(onChange)

    // Set up srcUrl and completedCrop
    act(() => {
      result.current.handleFileAccept({
        files: [new File(['x'], 'img.jpg', { type: 'image/jpeg' })],
      })
    })
    act(() => {
      result.current.setCompletedCrop({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        unit: 'px',
      })
    })

    // Provide a mock imgRef by replacing its current value
    Object.defineProperty(result.current.imgRef, 'current', {
      value: { naturalWidth: 800, naturalHeight: 600, width: 400, height: 300 },
      configurable: true,
    })

    await act(async () => {
      await result.current.handleConfirmCrop()
    })

    expect(mockUploadMedia).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith({
      id: 'uploaded-id',
      url: 'https://example.com/img.jpg',
    })
  })
})
