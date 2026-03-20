'use client'

import { useAddToCart, useCategoryBySlug, useProducts } from '@app/sdk'
import {
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { EmptyState } from '@/components/empty-state'
import { PageContainer } from '@/components/page-container'
import { ProductSkeleton } from '@/components/product-skeleton'
import { ProductGrid } from '@/components/products/product-grid'
import { toaster } from '@/components/ui/toaster'
import { useAuth } from '@/lib/auth-context'

export default function CategoryDetailPage() {
  const params = useParams<{ slug: string }>()
  const { user } = useAuth()
  const addToCartMutation = useAddToCart()
  const [page, setPage] = useState(1)

  const { data: category, isLoading: categoryLoading } = useCategoryBySlug(
    params.slug,
  )

  const { data: productsData, isLoading: productsLoading } = useProducts(
    {
      categoryId: category?.id,
      status: 'ACTIVE',
      page,
      limit: 12,
    },
    { enabled: !!category?.id },
  )

  const products = productsData?.items ?? []
  const totalPages = productsData?.totalPages ?? 1
  const loading = categoryLoading || productsLoading

  const handleAddToCart = async (variantId: string) => {
    if (!user) {
      toaster.error({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart.',
      })

      return
    }

    try {
      await addToCartMutation.mutateAsync({ variantId })
      toaster.success({ title: 'Added to cart!' })
    } catch {
      toaster.error({ title: 'Failed to add to cart' })
    }
  }

  if (categoryLoading) {
    return (
      <PageContainer>
        <Spinner size={'xl'} />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <VStack align={'stretch'} gap={'6'}>
        <VStack align={'flex-start'} gap={'1'}>
          <Heading size={'xl'}>{category?.name}</Heading>
          {category?.description && (
            <Text color={'fg.muted'}>{category.description}</Text>
          )}
        </VStack>

        {loading ? (
          <ProductSkeleton count={12} />
        ) : products.length === 0 ? (
          <EmptyState
            title={'No products in this category'}
            description={'Check back later for new products.'}
            actionLabel={'Browse All Products'}
            actionHref={'/products'}
          />
        ) : (
          <>
            <ProductGrid products={products} onAddToCart={handleAddToCart} />
            {totalPages > 1 && (
              <HStack justify={'center'} gap={'4'}>
                <Button
                  variant={'outline'}
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Text color={'fg.muted'}>
                  Page {page} of {totalPages}
                </Text>
                <Button
                  variant={'outline'}
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </HStack>
            )}
          </>
        )}
      </VStack>
    </PageContainer>
  )
}
