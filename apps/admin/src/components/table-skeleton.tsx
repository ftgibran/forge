'use client'

import { Stack } from '@chakra-ui/react'

import { Skeleton } from '@/components/ui/skeleton'

interface TableSkeletonProps {
  rows?: number
}

export function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <Stack gap={'3'}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={'12'} />
      ))}
    </Stack>
  )
}
