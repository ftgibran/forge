'use client'

import { useGetReview } from '@app/sdk'
import { Stack, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

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
  const { data: review, isError } = useGetReview(reviewId ?? '', {
    query: { enabled: open && !!reviewId },
  })

  useEffect(() => {
    if (isError) toaster.error({ title: t('loadReviewFailed') })
  }, [isError, t])

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
