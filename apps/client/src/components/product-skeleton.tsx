'use client'

import { Card, SimpleGrid, VStack } from '@chakra-ui/react'

import { Skeleton, SkeletonText } from '@/components/ui/skeleton'

interface ProductSkeletonProps {
  count?: number
}

export function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={'6'} w={'full'}>
      {Array.from({ length: count }).map((_, i) => (
        <Card.Root key={i} overflow={'hidden'}>
          <Skeleton height={'200px'} />
          <Card.Body>
            <VStack align={'stretch'} gap={'2'}>
              <SkeletonText noOfLines={1} />
              <SkeletonText noOfLines={1} />
              <Skeleton height={'20px'} width={'60px'} />
            </VStack>
          </Card.Body>
        </Card.Root>
      ))}
    </SimpleGrid>
  )
}
