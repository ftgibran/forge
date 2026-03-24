'use client'

import type { Product } from '@app/sdk'
import {
  Button,
  Card,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LuShoppingCart, LuStar } from 'react-icons/lu'

import { PriceDisplay } from '@/components/price-display'

interface ProductCardProps {
  product: Product
  onAddToCart?: (variantId: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const firstImage = product.images?.[0]
  const firstVariant = product.variants?.[0]
  const t = useTranslations('products')

  return (
    <Card.Root
      overflow={'hidden'}
      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
      transition={'all 0.2s'}
    >
      <Link href={`/products/${product.slug}`}>
        <Image
          src={firstImage?.media?.url || '/placeholder.svg'}
          alt={firstImage?.altText || product.name}
          w={'full'}
          h={'200px'}
          objectFit={'cover'}
        />
      </Link>
      <Card.Body>
        <VStack align={'stretch'} gap={'2'}>
          <Link href={`/products/${product.slug}`}>
            <Heading size={'sm'} lineClamp={1}>
              {product.name}
            </Heading>
          </Link>

          {product.vendor && (
            <Link href={`/vendors/${product.vendor.slug}`}>
              <Text fontSize={'xs'} color={'fg.muted'}>
                {t('byVendor', { name: product.vendor.name })}
              </Text>
            </Link>
          )}

          <HStack gap={'1'}>
            {product.averageRating !== undefined &&
              product.averageRating > 0 && (
                <>
                  <LuStar
                    fill={'currentColor'}
                    color={'var(--chakra-colors-yellow-400)'}
                    size={14}
                  />
                  <Text fontSize={'sm'}>
                    {Number(product.averageRating).toFixed(1)}
                  </Text>
                  {product._count?.reviews !== undefined && (
                    <Text fontSize={'xs'} color={'fg.muted'}>
                      ({product._count.reviews})
                    </Text>
                  )}
                </>
              )}
          </HStack>

          {firstVariant && (
            <PriceDisplay
              price={firstVariant.price}
              compareAtPrice={firstVariant.compareAtPrice}
            />
          )}
        </VStack>
      </Card.Body>
      {firstVariant && onAddToCart && (
        <Card.Footer>
          <Button
            size={'sm'}
            colorPalette={'blue'}
            w={'full'}
            onClick={() => onAddToCart(firstVariant.id)}
          >
            <LuShoppingCart />
            {t('addToCart')}
          </Button>
        </Card.Footer>
      )}
    </Card.Root>
  )
}
