'use client'

import { Button, Heading, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <VStack py={'16'} gap={'4'} textAlign={'center'}>
      {icon && <div>{icon}</div>}
      <Heading size={'md'}>{title}</Heading>
      {description && <Text color={'fg.muted'}>{description}</Text>}
      {actionLabel && actionHref && (
        <Button asChild colorPalette={'blue'}>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </VStack>
  )
}
