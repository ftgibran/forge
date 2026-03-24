'use client'

import type { Product } from '@app/sdk'
import { Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { ProductGrid } from '@/components/products/ProductGrid'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations('landing')

  if (products.length === 0) return null

  return (
    <Container maxW={'7xl'} py={'16'} px={'4'}>
      <VStack gap={'8'}>
        <VStack gap={'2'} textAlign={'center'}>
          <Heading size={'2xl'}>{t('featuredHeading')}</Heading>
          <Text color={'fg.muted'}>{t('featuredDescription')}</Text>
        </VStack>
        <ProductGrid products={products} />
        <Button asChild variant={'outline'} size={'lg'}>
          <Link href={'/products'}>{t('featuredViewAll')}</Link>
        </Button>
      </VStack>
    </Container>
  )
}
