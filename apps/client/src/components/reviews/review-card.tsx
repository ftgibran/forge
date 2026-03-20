'use client'

import type { Review } from '@app/sdk'
import { HStack, Text, VStack } from '@chakra-ui/react'
import { LuStar } from 'react-icons/lu'

import { Avatar } from '@/components/ui/avatar'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <VStack
      align={'flex-start'}
      gap={'2'}
      p={'4'}
      borderWidth={'1px'}
      borderRadius={'md'}
    >
      <HStack gap={'3'}>
        <Avatar name={review.user?.name || 'User'} size={'sm'} />
        <VStack align={'flex-start'} gap={'0'}>
          <Text fontWeight={'medium'} fontSize={'sm'}>
            {review.user?.name || 'Anonymous'}
          </Text>
          <HStack gap={'1'}>
            {Array.from({ length: 5 }).map((_, i) => (
              <LuStar
                key={i}
                size={12}
                fill={i < review.rating ? 'currentColor' : 'none'}
                color={
                  i < review.rating
                    ? 'var(--chakra-colors-yellow-400)'
                    : 'var(--chakra-colors-gray-300)'
                }
              />
            ))}
          </HStack>
        </VStack>
        <Text fontSize={'xs'} color={'fg.muted'} ml={'auto'}>
          {new Date(review.createdAt).toLocaleDateString()}
        </Text>
      </HStack>
      {review.title && <Text fontWeight={'medium'}>{review.title}</Text>}
      {review.comment && (
        <Text fontSize={'sm'} color={'fg.muted'}>
          {review.comment}
        </Text>
      )}
    </VStack>
  )
}
