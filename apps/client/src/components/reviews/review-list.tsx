'use client'

import { useGetProductReviews } from '@app/sdk'
import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { LuStar } from 'react-icons/lu'

import { ReviewCard } from './review-card'

interface ReviewListProps {
  productId: string
  averageRating?: number
  reviewCount?: number
  refreshKey?: number
}

export function ReviewList({
  productId,
  averageRating,
  reviewCount,
}: ReviewListProps) {
  const [page, setPage] = useState(1)
  const t = useTranslations('reviews')
  const tc = useTranslations('common')

  const { data } = useGetProductReviews(productId, { page, limit: 10 })
  const reviews = data?.items ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <VStack align={'stretch'} gap={'4'}>
      <HStack gap={'4'}>
        <Heading size={'md'}>{t('heading')}</Heading>
        {averageRating !== undefined && averageRating > 0 && (
          <HStack gap={'1'}>
            <LuStar
              fill={'currentColor'}
              color={'var(--chakra-colors-yellow-400)'}
              size={16}
            />
            <Text fontWeight={'medium'}>
              {Number(averageRating).toFixed(1)}
            </Text>
            {reviewCount !== undefined && (
              <Text color={'fg.muted'} fontSize={'sm'}>
                {t('reviewCount', { count: reviewCount })}
              </Text>
            )}
          </HStack>
        )}
      </HStack>

      {reviews.length === 0 ? (
        <Text color={'fg.muted'}>{t('emptyMessage')}</Text>
      ) : (
        <>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {totalPages > 1 && (
            <HStack justify={'center'} gap={'2'}>
              <Button
                size={'sm'}
                variant={'outline'}
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                {tc('previous')}
              </Button>
              <Text fontSize={'sm'} color={'fg.muted'}>
                {tc('pageOf', { page, totalPages })}
              </Text>
              <Button
                size={'sm'}
                variant={'outline'}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {tc('next')}
              </Button>
            </HStack>
          )}
        </>
      )}
    </VStack>
  )
}
