'use client'

import type { Review } from '@app/sdk'
import { useApiClient } from '@app/sdk'
import { Stack, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { toaster } from '@/components/ui/toaster'

interface ReviewDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reviewId: string | null
}

export function ReviewDetailDialog({
  open,
  onOpenChange,
  reviewId,
}: ReviewDetailDialogProps) {
  const t = useTranslations('reviews')
  const [review, setReview] = useState<Review | null>(null)
  const client = useApiClient()

  useEffect(() => {
    if (!open || !reviewId) return

    client
      .get<Review>(`/reviews/${reviewId}`)
      .then(setReview)
      .catch(() => toaster.error({ title: t('loadReviewFailed') }))
  }, [open, reviewId, client, t])

  if (!review) return null

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('reviewDetails')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Stack gap={'3'}>
            <Text fontSize={'sm'}>
              <strong>{t('product')}:</strong> {review.product?.name}
            </Text>
            <Text fontSize={'sm'}>
              <strong>{t('user')}:</strong> {review.user?.name}
            </Text>
            <Text fontSize={'sm'}>
              <strong>{t('rating')}:</strong> {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </Text>
            {review.title && (
              <Text fontSize={'sm'}>
                <strong>{t('reviewTitle')}:</strong> {review.title}
              </Text>
            )}
            {review.comment && (
              <Text fontSize={'sm'}>
                <strong>{t('comment')}:</strong> {review.comment}
              </Text>
            )}
          </Stack>
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
