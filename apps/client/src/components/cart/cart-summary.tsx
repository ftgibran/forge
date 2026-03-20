'use client'

import type { CartItem } from '@app/sdk'
import { Button, Card, HStack, Separator, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'

interface CartSummaryProps {
  items: CartItem[]
}

export function CartSummary({ items }: CartSummaryProps) {
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.variant?.price ?? 0)

    return sum + price * item.quantity
  }, 0)

  return (
    <Card.Root>
      <Card.Header>
        <Text fontWeight={'bold'} fontSize={'lg'}>
          Order Summary
        </Text>
      </Card.Header>
      <Card.Body>
        <VStack gap={'3'} align={'stretch'}>
          <HStack justify={'space-between'}>
            <Text color={'fg.muted'}>Subtotal</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </HStack>
          <Separator />
          <HStack justify={'space-between'}>
            <Text fontWeight={'bold'}>Total</Text>
            <Text fontWeight={'bold'} fontSize={'lg'}>
              ${subtotal.toFixed(2)}
            </Text>
          </HStack>
        </VStack>
      </Card.Body>
      <Card.Footer>
        <Button asChild colorPalette={'blue'} w={'full'}>
          <Link href={'/checkout'}>Proceed to Checkout</Link>
        </Button>
      </Card.Footer>
    </Card.Root>
  )
}
