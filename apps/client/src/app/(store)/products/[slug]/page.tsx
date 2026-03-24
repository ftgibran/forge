'use client'

import { useAddToCart, useGetProduct } from '@app/sdk'
import { useAuth } from '@app/sdk'
import { NativeSelectField, NativeSelectRoot } from '@app/theme'
import { toaster } from '@app/theme'
import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Separator,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { PageContainer } from '@/components/PageContainer'
import { PriceDisplay } from '@/components/PriceDisplay'
import { ProductImages } from '@/components/products/ProductImages'
import { ProductSpecs } from '@/components/products/ProductSpecs'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { ReviewList } from '@/components/reviews/ReviewList'

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const { currentUser } = useAuth()
  const addToCartMutation = useAddToCart()
  const [addingToCart, setAddingToCart] = useState(false)
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0)
  const t = useTranslations('products')
  const tc = useTranslations('common')

  const { data: product, isLoading } = useGetProduct(params.slug)

  const [selectedVariantId, setSelectedVariantId] = useState('')

  const effectiveVariantId =
    selectedVariantId ||
    (product?.variants && product.variants.length > 0
      ? product.variants[0].id
      : '')

  const selectedVariant = product?.variants?.find(
    (v) => v.id === effectiveVariantId,
  )

  const handleAddToCart = async () => {
    if (!currentUser) {
      toaster.error({
        title: tc('signInRequired'),
        description: tc('signInDescription'),
      })

      return
    }

    if (!effectiveVariantId) return

    setAddingToCart(true)
    try {
      await addToCartMutation.mutateAsync({
        data: { variantId: effectiveVariantId, quantity: 1 },
      })
      toaster.success({ title: tc('addedToCart') })
    } catch {
      toaster.error({ title: tc('failedToAddToCart') })
    } finally {
      setAddingToCart(false)
    }
  }

  if (isLoading) {
    return (
      <VStack py={'20'} justify={'center'}>
        <Spinner size={'xl'} />
      </VStack>
    )
  }

  if (!product) {
    return (
      <PageContainer>
        <Text>{t('notFound')}</Text>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={'8'}>
        <GridItem>
          <ProductImages
            images={product.images || []}
            productName={product.name}
          />
        </GridItem>

        <GridItem>
          <VStack align={'stretch'} gap={'4'}>
            {product.category && (
              <Link href={`/categories/${product.category.slug}`}>
                <Badge colorPalette={'blue'} size={'sm'}>
                  {product.category.name}
                </Badge>
              </Link>
            )}

            <Heading size={'2xl'}>{product.name}</Heading>

            {product.vendor && (
              <Link href={`/vendors/${product.vendor.slug}`}>
                <Text color={'fg.muted'}>
                  {t('byVendor', { name: product.vendor.name })}
                </Text>
              </Link>
            )}

            {product.description && (
              <Text color={'fg.muted'}>{product.description}</Text>
            )}

            {selectedVariant && (
              <PriceDisplay
                price={selectedVariant.price}
                compareAtPrice={selectedVariant.compareAtPrice}
                size={'lg'}
              />
            )}

            {product.variants && product.variants.length > 1 && (
              <NativeSelectRoot>
                <NativeSelectField
                  value={effectiveVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name} — ${Number(variant.price).toFixed(2)}
                      {variant.stock <= 0 ? ` (${t('outOfStock')})` : ''}
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            )}

            {selectedVariant && (
              <Text fontSize={'sm'} color={'fg.muted'}>
                {selectedVariant.stock > 0
                  ? t('inStock', { count: selectedVariant.stock })
                  : t('outOfStock')}
              </Text>
            )}

            <Button
              colorPalette={'blue'}
              size={'lg'}
              onClick={handleAddToCart}
              loading={addingToCart}
              disabled={!selectedVariant || selectedVariant.stock <= 0}
            >
              {t('addToCart')}
            </Button>

            <Separator />

            <Box>
              <Heading size={'md'} mb={'3'}>
                {t('specificationsHeading')}
              </Heading>
              <ProductSpecs product={product} />
            </Box>
          </VStack>
        </GridItem>
      </Grid>

      <Separator my={'8'} />

      <VStack align={'stretch'} gap={'8'}>
        <ReviewList
          productId={product.id}
          averageRating={product.averageRating}
          reviewCount={product._count?.reviews}
          refreshKey={reviewRefreshKey}
        />

        {currentUser && (
          <Box maxW={'lg'}>
            <Heading size={'md'} mb={'4'}>
              {t('writeReview')}
            </Heading>
            <ReviewForm
              productId={product.id}
              onSubmitted={() => setReviewRefreshKey((k) => k + 1)}
            />
          </Box>
        )}
      </VStack>
    </PageContainer>
  )
}
