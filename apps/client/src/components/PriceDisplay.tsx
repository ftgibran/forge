'use client'

import { HStack, Text } from '@chakra-ui/react'

interface PriceDisplayProps {
  price: number
  compareAtPrice?: number | null
  size?: 'sm' | 'md' | 'lg'
}

export function PriceDisplay({
  price,
  compareAtPrice,
  size = 'md',
}: PriceDisplayProps) {
  const fontSize = size === 'lg' ? 'xl' : size === 'md' ? 'md' : 'sm'

  return (
    <HStack gap={'2'}>
      <Text fontWeight={'bold'} fontSize={fontSize}>
        ${Number(price).toFixed(2)}
      </Text>
      {compareAtPrice && compareAtPrice > price && (
        <Text
          fontSize={'sm'}
          color={'fg.muted'}
          textDecoration={'line-through'}
        >
          ${Number(compareAtPrice).toFixed(2)}
        </Text>
      )}
    </HStack>
  )
}
