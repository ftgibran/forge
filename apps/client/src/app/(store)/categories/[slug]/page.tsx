'use client'

import { useAddToCart, useGetCategory, useGetProducts } from '@app/sdk'
import { useAuth } from '@app/sdk'
import { toaster } from '@app/theme'
import {
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { EmptyState } from '@/components/EmptyState'
import { PageContainer } from '@/components/PageContainer'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductSkeleton } from '@/components/ProductSkeleton'

export default function CategoryDetailPage() {
  const params = useParams<{ slug: string }>()
  const { currentUser } = useAuth()
  const addToCartMutation = useAddToCart()
  const [page, setPage] = useState(1)
  const t = useTranslations('categories')
  const tc = useTranslations('common')

  const { data: category, isLoading: categoryLoading } = useGetCategory(
    params.slug,
  )

  const { data: productsData, isLoading: productsLoading } = useGetProducts(
    {
      categoryId: category?.id,
      status: 'ACTIVE',
      page,
      limit: 12,
    },
    { query: { enabled: !!category?.id } },
  )

  const products = productsData?.items ?? []
  const totalPages = productsData?.totalPages ?? 1
  const loading = categoryLoading || productsLoading

  const handleAddToCart = async (variantId: string) => {
    if (!currentUser) {
      toaster.error({
        title: tc('signInRequired'),
        description: tc('signInDescription'),
      })

      return
    }

    try {
      await addToCartMutation.mutateAsync({ data: { variantId, quantity: 1 } })
      toaster.success({ title: tc('addedToCart') })
    } catch {
      toaster.error({ title: tc('failedToAddToCart') })
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
            title={t('noProductsTitle')}
            description={t('noProductsDescription')}
            actionLabel={t('browseAllProducts')}
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
                  {tc('previous')}
                </Button>
                <Text color={'fg.muted'}>
                  {tc('pageOf', { page, totalPages })}
                </Text>
                <Button
                  variant={'outline'}
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {tc('next')}
                </Button>
              </HStack>
            )}
          </>
        )}
      </VStack>
    </PageContainer>
  )
}
