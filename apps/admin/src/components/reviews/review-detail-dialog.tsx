'use client'

import { useCallback, useEffect, useState } from 'react'
import { Stack, Text } from '@chakra-ui/react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
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
  const [review, setReview] = useState<Review | null>(null)

  const fetch = useCallback(async () => {
    if (!reviewId) return
    try {
      const r = await reviewsApi.get(reviewId)
      setReview(r)
    } catch {
      toaster.error({ title: 'Failed to load review' })
    }
  }, [reviewId])

  useEffect(() => {
    if (open && reviewId) fetch()
  }, [open, reviewId, fetch])

  if (!review) return null

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Stack gap='3'>
            <Text fontSize='sm'>
              <strong>Product:</strong> {review.product?.name}
            </Text>
            <Text fontSize='sm'>
              <strong>User:</strong> {review.user?.name}
            </Text>
            <Text fontSize='sm'>
              <strong>Rating:</strong> {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </Text>
            {review.title && (
              <Text fontSize='sm'>
                <strong>Title:</strong> {review.title}
              </Text>
            )}
            {review.comment && (
              <Text fontSize='sm'>
                <strong>Comment:</strong> {review.comment}
              </Text>
            )}
          </Stack>
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
