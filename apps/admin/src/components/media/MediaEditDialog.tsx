'use client'

import type { MediaDto } from '@app/sdk'
import { useUpdateMedia } from '@app/sdk'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  Field,
  toaster,
} from '@app/theme'
import { Button, Input } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

interface MediaEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  media: MediaDto | null
  onSaved: () => void
}

export function MediaEditDialog({
  open,
  onOpenChange,
  media,
  onSaved,
}: MediaEditDialogProps) {
  const t = useTranslations('media')
  const tc = useTranslations('common')
  const [alt, setAlt] = useState('')

  const updateMedia = useUpdateMedia()

  useEffect(() => {
    setAlt(media?.alt ?? '')
  }, [media, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!media) return

    updateMedia.mutate(
      { id: media.id, data: { alt: alt || null } },
      {
        onSuccess: () => {
          toaster.success({ title: t('mediaUpdated') })
          onOpenChange(false)
          onSaved()
        },
        onError: () => {
          toaster.error({ title: tc('updateFailed') })
        },
      },
    )
  }

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editMedia')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <Field label={t('altText')}>
              <Input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder={t('altTextPlaceholder')}
              />
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button variant={'outline'} onClick={() => onOpenChange(false)}>
              {tc('cancel')}
            </Button>
            <Button
              type={'submit'}
              colorPalette={'blue'}
              loading={updateMedia.isPending}
            >
              {tc('save')}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
