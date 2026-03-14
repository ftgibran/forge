'use client'

import { Button, Stack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  loading,
}: ConfirmDialogProps) {
  const t = useTranslations('common')

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      role={'alertdialog'}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{description}</DialogBody>
        <DialogFooter>
          <Stack direction={'row'} gap={'2'}>
            <Button variant={'outline'} onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button colorPalette={'red'} onClick={onConfirm} loading={loading}>
              {t('delete')}
            </Button>
          </Stack>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
