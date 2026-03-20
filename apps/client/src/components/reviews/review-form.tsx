'use client'

import { useCreateReview } from '@app/sdk'
import {
  Button,
  HStack,
  IconButton,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { useState } from 'react'
import { LuStar } from 'react-icons/lu'

import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'

interface ReviewFormProps {
  productId: string
  onSubmitted: () => void
}

export function ReviewForm({ productId, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')

  const createReviewMutation = useCreateReview()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toaster.error({ title: 'Please select a rating' })

      return
    }

    try {
      await createReviewMutation.mutateAsync({
        productId,
        rating,
        title: title || undefined,
        comment: comment || undefined,
      })
      toaster.success({ title: 'Review submitted!' })
      setRating(0)
      setTitle('')
      setComment('')
      onSubmitted()
    } catch {
      toaster.error({ title: 'Failed to submit review' })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={'4'}>
        <Field label={'Rating'}>
          <HStack gap={'1'}>
            {Array.from({ length: 5 }).map((_, i) => (
              <IconButton
                key={i}
                aria-label={`Rate ${i + 1}`}
                variant={'ghost'}
                size={'sm'}
                onClick={() => setRating(i + 1)}
                type={'button'}
              >
                <LuStar
                  fill={i < rating ? 'currentColor' : 'none'}
                  color={
                    i < rating
                      ? 'var(--chakra-colors-yellow-400)'
                      : 'var(--chakra-colors-gray-300)'
                  }
                />
              </IconButton>
            ))}
          </HStack>
        </Field>
        <Field label={'Title (optional)'}>
          <Input
            placeholder={'Summary of your review'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field label={'Comment (optional)'}>
          <Textarea
            placeholder={'Tell us more about your experience...'}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </Field>
        <Button
          type={'submit'}
          colorPalette={'blue'}
          loading={createReviewMutation.isPending}
        >
          Submit Review
        </Button>
      </Stack>
    </form>
  )
}
