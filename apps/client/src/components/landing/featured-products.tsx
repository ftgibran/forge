'use client'

import { Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'

import { ProductGrid } from '@/components/products/product-grid'
import type { Product } from '@/types'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <Container maxW={'7xl'} py={'16'} px={'4'}>
      <VStack gap={'8'}>
        <VStack gap={'2'} textAlign={'center'}>
          <Heading size={'2xl'}>Featured Products</Heading>
          <Text color={'fg.muted'}>
            Check out our latest and most popular items
          </Text>
        </VStack>
        <ProductGrid products={products} />
        <Button asChild variant={'outline'} size={'lg'}>
          <Link href={'/products'}>View All Products</Link>
        </Button>
      </VStack>
    </Container>
  )
}
