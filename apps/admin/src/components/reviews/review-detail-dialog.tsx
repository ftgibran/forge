'use client'

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
import { reviewsApi } from '@/lib/api/reviews'
import type { Review } from '@/types'

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

  useEffect(() => {
    if (!open || !reviewId) return

    reviewsApi
      .get(reviewId)
      .then(setReview)
      .catch(() => toaster.error({ title: t('loadReviewFailed') }))
  }, [open, reviewId, t])

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
