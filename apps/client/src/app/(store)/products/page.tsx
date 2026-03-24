'use client'

import { useAddToCart, useGetProducts } from '@app/sdk'
import { useAuth } from '@app/sdk'
import { toaster } from '@app/theme'
import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Suspense, useState } from 'react'

import { EmptyState } from '@/components/EmptyState'
import { PageContainer } from '@/components/PageContainer'
import { ProductFilters } from '@/components/products/ProductFilters'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductSkeleton } from '@/components/ProductSkeleton'

function ProductsContent() {
  const searchParams = useSearchParams()
  const { currentUser } = useAuth()
  const addToCartMutation = useAddToCart()
  const [page, setPage] = useState(1)
  const t = useTranslations('products')
  const tc = useTranslations('common')
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || '',
    filamentType: searchParams.get('filamentType') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  })

  const { data, isLoading } = useGetProducts({
    ...filters,
    status: 'ACTIVE',
    page,
    limit: 12,
  })

  const products = data?.items ?? []
  const totalPages = data?.totalPages ?? 1

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPage(1)
  }

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

  return (
    <PageContainer>
      <VStack align={'stretch'} gap={'6'}>
        <Heading size={'xl'}>{t('heading')}</Heading>
        <ProductFilters
          search={filters.search}
          categoryId={filters.categoryId}
          filamentType={filters.filamentType}
          sortBy={filters.sortBy}
          onFilterChange={handleFilterChange}
        />

        {isLoading ? (
          <ProductSkeleton count={12} />
        ) : products.length === 0 ? (
          <EmptyState
            title={t('emptyTitle')}
            description={t('emptyDescription')}
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <ProductSkeleton count={12} />
        </PageContainer>
      }
    >
      <ProductsContent />
    </Suspense>
  )
}
