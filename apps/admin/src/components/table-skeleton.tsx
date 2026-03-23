'use client'

import { Skeleton } from '@app/theme'
import { Stack } from '@chakra-ui/react'

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
