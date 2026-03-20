'use client'

import { useAddToCart, useProductBySlug } from '@app/sdk'
import { useAuth } from '@app/sdk'
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
import { useState } from 'react'

import { PageContainer } from '@/components/page-container'
import { PriceDisplay } from '@/components/price-display'
import { ProductImages } from '@/components/products/product-images'
import { ProductSpecs } from '@/components/products/product-specs'
import { ReviewForm } from '@/components/reviews/review-form'
import { ReviewList } from '@/components/reviews/review-list'
import {
  NativeSelectField,
  NativeSelectRoot,
} from '@/components/ui/native-select'
import { toaster } from '@/components/ui/toaster'

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const { user } = useAuth()
  const addToCartMutation = useAddToCart()
  const [addingToCart, setAddingToCart] = useState(false)
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0)

  const { data: product, isLoading } = useProductBySlug(params.slug)

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
    if (!user) {
      toaster.error({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart.',
      })

      return
    }

    if (!effectiveVariantId) return

    setAddingToCart(true)
    try {
      await addToCartMutation.mutateAsync({ variantId: effectiveVariantId })
      toaster.success({ title: 'Added to cart!' })
    } catch {
      toaster.error({ title: 'Failed to add to cart' })
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
        <Text>Product not found.</Text>
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
                <Text color={'fg.muted'}>by {product.vendor.name}</Text>
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
                      {variant.stock <= 0 ? ' (Out of stock)' : ''}
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            )}

            {selectedVariant && (
              <Text fontSize={'sm'} color={'fg.muted'}>
                {selectedVariant.stock > 0
                  ? `${selectedVariant.stock} in stock`
                  : 'Out of stock'}
              </Text>
            )}

            <Button
              colorPalette={'blue'}
              size={'lg'}
              onClick={handleAddToCart}
              loading={addingToCart}
              disabled={!selectedVariant || selectedVariant.stock <= 0}
            >
              Add to Cart
            </Button>

            <Separator />

            <Box>
              <Heading size={'md'} mb={'3'}>
                Specifications
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

        {user && (
          <Box maxW={'lg'}>
            <Heading size={'md'} mb={'4'}>
              Write a Review
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
