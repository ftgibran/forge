'use client'

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
import { useCallback, useEffect, useState } from 'react'

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
import { productsApi } from '@/lib/api/products'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/types'

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0)

  const fetchProduct = useCallback(async () => {
    setLoading(true)
    try {
      const data = await productsApi.getBySlug(params.slug)

      setProduct(data)

      if (data.variants && data.variants.length > 0) {
        setSelectedVariantId(data.variants[0].id)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [params.slug])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const selectedVariant = product?.variants?.find(
    (v) => v.id === selectedVariantId,
  )

  const handleAddToCart = async () => {
    if (!user) {
      toaster.error({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart.',
      })

      return
    }

    if (!selectedVariantId) return

    setAddingToCart(true)
    try {
      await addToCart(selectedVariantId)
      toaster.success({ title: 'Added to cart!' })
    } catch {
      toaster.error({ title: 'Failed to add to cart' })
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
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
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name} — ${variant.price.toFixed(2)}
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
