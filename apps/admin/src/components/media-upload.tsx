'use client'

import 'react-image-crop/dist/ReactCrop.css'

import { type MediaDto, useUploadMedia } from '@app/sdk'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  FileUploadDropzone,
  FileUploadRoot,
  toaster,
} from '@app/theme'
import { Box, Button, HStack, Image, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useCallback, useRef, useState } from 'react'
import ReactCrop, {
  centerCrop,
  type Crop,
  makeAspectCrop,
  type PixelCrop,
} from 'react-image-crop'

interface MediaUploadProps {
  value: MediaDto | null
  onChange: (media: MediaDto | null) => void
  aspectRatio?: number
}

export function MediaUpload({
  value,
  onChange,
  aspectRatio,
}: MediaUploadProps) {
  const t = useTranslations('mediaUpload')
  const tc = useTranslations('common')

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

  const thumbnailUrl = value?.sizes
    ? ((value.sizes as Record<string, { url?: string | null }>)['thumbnail']
        ?.url ?? value.url)
    : value?.url

  return (
    <>
      {value ? (
        <Box>
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={value.alt ?? ''}
              boxSize={'80px'}
              objectFit={'cover'}
              borderRadius={'md'}
              mb={'2'}
            />
          )}
          <HStack gap={'2'}>
            <FileUploadRoot
              maxFiles={1}
              accept={['image/*']}
              onFileAccept={handleFileAccept}
            >
              <FileUploadDropzone label={t('change')} description={''} />
            </FileUploadRoot>
            <Button
              size={'sm'}
              variant={'ghost'}
              colorPalette={'red'}
              onClick={() => onChange(null)}
            >
              {t('remove')}
            </Button>
          </HStack>
        </Box>
      ) : (
        <FileUploadRoot
          maxFiles={1}
          accept={['image/*']}
          onFileAccept={handleFileAccept}
        >
          <FileUploadDropzone
            label={t('dropzoneLabel')}
            description={t('dropzoneDescription')}
          />
        </FileUploadRoot>
      )}

      <DialogRoot
        open={cropOpen}
        onOpenChange={(e) => !e.open && handleClose()}
      >
        <DialogContent maxW={'600px'}>
          <DialogHeader>
            <DialogTitle>{t('cropTitle')}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {srcUrl && (
              <Box overflow={'auto'}>
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={srcUrl}
                    alt={'Crop preview'}
                    onLoad={onImageLoad}
                    style={{ maxWidth: '100%' }}
                  />
                </ReactCrop>
              </Box>
            )}
            {!completedCrop && (
              <Text color={'fg.muted'} fontSize={'sm'} mt={'2'}>
                {t('dragToCrop')}
              </Text>
            )}
          </DialogBody>
          <DialogFooter>
            <Button
              variant={'outline'}
              onClick={handleClose}
              disabled={uploading}
            >
              {tc('cancel')}
            </Button>
            <Button
              colorPalette={'blue'}
              onClick={handleConfirmCrop}
              loading={uploading}
              disabled={!completedCrop}
            >
              {uploading ? t('uploading') : t('confirmCrop')}
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  )
}
