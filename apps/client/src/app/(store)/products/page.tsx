'use client'

import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'

import { EmptyState } from '@/components/empty-state'
import { PageContainer } from '@/components/page-container'
import { ProductSkeleton } from '@/components/product-skeleton'
import { ProductFilters } from '@/components/products/product-filters'
import { ProductGrid } from '@/components/products/product-grid'
import { toaster } from '@/components/ui/toaster'
import { productsApi } from '@/lib/api/products'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/types'

function ProductsContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || '',
    filamentType: searchParams.get('filamentType') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await productsApi.list({
        ...filters,
        status: 'ACTIVE',
        page,
        limit: 12,
      })

      setProducts(data.items)
      setTotalPages(data.totalPages)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPage(1)
  }

  const handleAddToCart = async (variantId: string) => {
    if (!user) {
      toaster.error({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart.',
      })

      return
    }

    try {
      await addToCart(variantId)
      toaster.success({ title: 'Added to cart!' })
    } catch {
      toaster.error({ title: 'Failed to add to cart' })
    }
  }

  return (
    <PageContainer>
      <VStack align={'stretch'} gap={'6'}>
        <Heading size={'xl'}>Products</Heading>
        <ProductFilters
          search={filters.search}
          categoryId={filters.categoryId}
          filamentType={filters.filamentType}
          sortBy={filters.sortBy}
          onFilterChange={handleFilterChange}
        />

        {loading ? (
          <ProductSkeleton count={12} />
        ) : products.length === 0 ? (
          <EmptyState
            title={'No products found'}
            description={'Try adjusting your filters or search query.'}
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
