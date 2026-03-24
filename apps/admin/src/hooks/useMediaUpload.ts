'use client'

import { type MediaDto, useUploadMedia } from '@app/sdk'
import { toaster } from '@app/theme'
import { useTranslations } from 'next-intl'
import { useCallback, useRef, useState } from 'react'
import {
  centerCrop,
  type Crop,
  makeAspectCrop,
  type PixelCrop,
} from 'react-image-crop'

interface UseMediaUploadParams {
  aspectRatio?: number
  onChange: (media: MediaDto | null) => void
}

export function useMediaUpload({
  aspectRatio,
  onChange,
}: UseMediaUploadParams) {
  const t = useTranslations('mediaUpload')

  const { mutateAsync: uploadMedia, isPending: uploading } = useUploadMedia()

  const [cropOpen, setCropOpen] = useState(false)
  const [srcUrl, setSrcUrl] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)

  const handleFileAccept = useCallback((details: { files: File[] }) => {
    const file = details.files[0]

    if (!file) return

    const url = URL.createObjectURL(file)

    setSrcUrl(url)
    setCrop(undefined)
    setCompletedCrop(undefined)
    setCropOpen(true)
  }, [])

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth, naturalHeight } = e.currentTarget

      if (aspectRatio) {
        const c = makeAspectCrop(
          { unit: '%', width: 90 },
          aspectRatio,
          naturalWidth,
          naturalHeight,
        )

        setCrop(centerCrop(c, naturalWidth, naturalHeight))
      } else {
        setCrop(
          centerCrop(
            { unit: '%', width: 90, height: 90, x: 5, y: 5 },
            naturalWidth,
            naturalHeight,
          ),
        )
      }
    },
    [aspectRatio],
  )

  const handleConfirmCrop = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !srcUrl) return

    const img = imgRef.current
    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height

    const canvas = document.createElement('canvas')

    canvas.width = completedCrop.width * scaleX
    canvas.height = completedCrop.height * scaleY
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    ctx.drawImage(
      img,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    )

    canvas.toBlob(
      async (blob) => {
        if (!blob) return

        try {
          const media = await uploadMedia({ data: { file: blob } })

          onChange(media)
          setCropOpen(false)
          URL.revokeObjectURL(srcUrl)
          setSrcUrl(null)
        } catch {
          toaster.error({ title: t('uploadFailed') })
        }
      },
      'image/jpeg',
      0.92,
    )
  }, [completedCrop, srcUrl, onChange, t, uploadMedia])

  const handleClose = useCallback(() => {
    if (srcUrl) {
      URL.revokeObjectURL(srcUrl)
      setSrcUrl(null)
    }

    setCropOpen(false)
  }, [srcUrl])

  return {
    imgRef,
    cropOpen,
    srcUrl,
    crop,
    completedCrop,
    uploading,
    setCrop,
    setCompletedCrop,
    handleFileAccept,
    onImageLoad,
    handleConfirmCrop,
    handleClose,
  }
}
