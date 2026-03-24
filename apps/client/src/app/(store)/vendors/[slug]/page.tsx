'use client'

import { useAddToCart, useGetProducts, useGetVendor } from '@app/sdk'
import { useAuth } from '@app/sdk'
import { toaster } from '@app/theme'
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
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { EmptyState } from '@/components/EmptyState'
import { PageContainer } from '@/components/PageContainer'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductSkeleton } from '@/components/ProductSkeleton'

export default function VendorDetailPage() {
  const params = useParams<{ slug: string }>()
  const { currentUser } = useAuth()
  const addToCartMutation = useAddToCart()
  const [page, setPage] = useState(1)
  const t = useTranslations('vendors')
  const tc = useTranslations('common')

  const { data: vendor, isLoading: vendorLoading } = useGetVendor(params.slug)

  const { data: productsData, isLoading: productsLoading } = useGetProducts(
    {
      vendorId: vendor?.id,
      status: 'ACTIVE',
      page,
      limit: 12,
    },
    { query: { enabled: !!vendor?.id } },
  )

  const products = productsData?.items ?? []
  const totalPages = productsData?.totalPages ?? 1
  const loading = vendorLoading || productsLoading

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

  if (vendorLoading) {
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
              <Badge colorPalette={'green'}>{t('verifiedSeller')}</Badge>
            )}
          </HStack>
          {vendor?.description && (
            <Text color={'fg.muted'}>{vendor.description}</Text>
          )}
          {vendor?._count && (
            <Text fontSize={'sm'} color={'fg.muted'}>
              {t('productsCount', { count: vendor._count.products })}
            </Text>
          )}
        </VStack>

        {loading ? (
          <ProductSkeleton count={12} />
        ) : products.length === 0 ? (
          <EmptyState
            title={t('noProductsTitle')}
            description={t('noProductsDescription')}
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
