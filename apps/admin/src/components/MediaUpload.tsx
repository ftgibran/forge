'use client'

import 'react-image-crop/dist/ReactCrop.css'

import { type MediaDto } from '@app/sdk'
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
} from '@app/theme'
import { Box, Button, HStack, Image, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import ReactCrop from 'react-image-crop'

import { useMediaUpload } from '../hooks/useMediaUpload'

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

  const {
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
  } = useMediaUpload({ aspectRatio, onChange })

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
