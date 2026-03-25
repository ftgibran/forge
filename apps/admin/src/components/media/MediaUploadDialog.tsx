'use client'

import type { MediaDto } from '@app/sdk'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@app/theme'
import { Button } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { MediaUpload } from '@/components/MediaUpload'

interface MediaUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function MediaUploadDialog({
  open,
  onOpenChange,
  onSaved,
}: MediaUploadDialogProps) {
  const t = useTranslations('media')
  const tc = useTranslations('common')
  const [media, setMedia] = useState<MediaDto | null>(null)

  useEffect(() => {
    if (!open) setMedia(null)
  }, [open])

  const handleChange = (m: MediaDto | null) => {
    if (m) {
      setMedia(m)
      onSaved()
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('uploadMedia')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <MediaUpload value={media} onChange={handleChange} />
        </DialogBody>
        <DialogFooter>
          <Button variant={'outline'} onClick={() => onOpenChange(false)}>
            {tc('cancel')}
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
