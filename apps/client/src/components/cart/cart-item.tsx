'use client'

import { HStack, IconButton, Image, Text, VStack } from '@chakra-ui/react'
import { LuMinus, LuPlus, LuTrash2 } from 'react-icons/lu'

import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const variant = item.variant
  const product = variant?.product

  return (
    <HStack gap={'4'} p={'4'} borderWidth={'1px'} borderRadius={'md'}>
      <Image
        src={
          product?.images?.[0]?.url ||
          'https://via.placeholder.com/80x80?text=No+Image'
        }
        alt={product?.name || 'Product'}
        w={'80px'}
        h={'80px'}
        objectFit={'cover'}
        borderRadius={'md'}
      />
      <VStack flex={'1'} align={'flex-start'} gap={'1'}>
        <Text fontWeight={'medium'}>{product?.name || 'Product'}</Text>
        {variant && (
          <Text fontSize={'sm'} color={'fg.muted'}>
            {variant.name}
          </Text>
        )}
        <Text fontWeight={'bold'}>
          ${variant ? Number(variant.price).toFixed(2) : '0.00'}
        </Text>
      </VStack>
      <HStack gap={'2'}>
        <IconButton
          aria-label={'Decrease quantity'}
          size={'xs'}
          variant={'outline'}
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <LuMinus />
        </IconButton>
        <Text fontWeight={'medium'} minW={'8'} textAlign={'center'}>
          {item.quantity}
        </Text>
        <IconButton
          aria-label={'Increase quantity'}
          size={'xs'}
          variant={'outline'}
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <LuPlus />
        </IconButton>
        <IconButton
          aria-label={'Remove item'}
          size={'xs'}
          variant={'ghost'}
          colorPalette={'red'}
          onClick={() => onRemove(item.id)}
        >
          <LuTrash2 />
        </IconButton>
      </HStack>
    </HStack>
  )
}
