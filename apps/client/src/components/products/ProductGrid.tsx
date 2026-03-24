'use client'

import type { Product } from '@app/sdk'
import { SimpleGrid } from '@chakra-ui/react'

import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onAddToCart?: (variantId: string) => void
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={'6'} w={'full'}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </SimpleGrid>
  )
}
