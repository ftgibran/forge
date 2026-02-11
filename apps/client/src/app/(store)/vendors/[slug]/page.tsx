'use client'

import {
  Badge,
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { EmptyState } from '@/components/empty-state'
import { PageContainer } from '@/components/page-container'
import { ProductSkeleton } from '@/components/product-skeleton'
import { ProductGrid } from '@/components/products/product-grid'
import { toaster } from '@/components/ui/toaster'
import { productsApi } from '@/lib/api/products'
import { vendorsApi } from '@/lib/api/vendors'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import type { Product, Vendor } from '@/types'

export default function VendorDetailPage() {
  const params = useParams<{ slug: string }>()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const v = await vendorsApi.getBySlug(params.slug)

      setVendor(v)

      const prods = await productsApi.list({
        vendorId: v.id,
        status: 'ACTIVE',
        page,
        limit: 12,
      })

      setProducts(prods.items)
      setTotalPages(prods.totalPages)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [params.slug, page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

  if (loading && !vendor) {
    return (
      <PageContainer>
        <Spinner size={'xl'} />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <VStack align={'stretch'} gap={'6'}>
        <VStack align={'flex-start'} gap={'2'}>
          <HStack gap={'3'}>
            <Heading size={'xl'}>{vendor?.name}</Heading>
            {vendor?.status === 'ACTIVE' && (
              <Badge colorPalette={'green'}>Verified Seller</Badge>
            )}
          </HStack>
          {vendor?.description && (
            <Text color={'fg.muted'}>{vendor.description}</Text>
          )}
          {vendor?._count && (
            <Text fontSize={'sm'} color={'fg.muted'}>
              {vendor._count.products} products
            </Text>
          )}
        </VStack>

        {loading ? (
          <ProductSkeleton count={12} />
        ) : products.length === 0 ? (
          <EmptyState
            title={'No products yet'}
            description={"This vendor hasn't listed any products yet."}
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
