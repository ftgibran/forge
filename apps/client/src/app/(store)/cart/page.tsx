'use client'

import { useGetCart, useRemoveCartItem, useUpdateCartItem } from '@app/sdk'
import { toaster } from '@app/theme'
import { Grid, GridItem, Heading, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { LuShoppingCart } from 'react-icons/lu'

import { AuthGuard } from '@/components/AuthGuard'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { EmptyState } from '@/components/EmptyState'
import { PageContainer } from '@/components/PageContainer'

export default function CartPage() {
  const { data: cart } = useGetCart()
  const updateCartItemMutation = useUpdateCartItem()
  const removeCartItemMutation = useRemoveCartItem()
  const t = useTranslations('cart')

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateCartItemMutation.mutateAsync({ itemId, data: { quantity } })
    } catch {
      toaster.error({ title: t('failedUpdateQuantity') })
    }
  }

  const handleRemove = async (itemId: string) => {
    try {
      await removeCartItemMutation.mutateAsync({ itemId })
      toaster.success({ title: t('itemRemoved') })
    } catch {
      toaster.error({ title: t('failedRemoveItem') })
    }
  }

  return (
    <AuthGuard>
      <PageContainer>
        <Heading size={'xl'} mb={'6'}>
          {t('heading')}
        </Heading>

        {!cart?.items || cart.items.length === 0 ? (
          <EmptyState
            icon={<LuShoppingCart size={48} />}
            title={t('emptyTitle')}
            description={t('emptyDescription')}
            actionLabel={t('browseProducts')}
            actionHref={'/products'}
          />
        ) : (
          <Grid templateColumns={{ base: '1fr', lg: '1fr 350px' }} gap={'8'}>
            <GridItem>
              <VStack align={'stretch'} gap={'4'}>
                {cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemove}
                  />
                ))}
              </VStack>
            </GridItem>
            <GridItem>
              <CartSummary items={cart.items} />
            </GridItem>
          </Grid>
        )}
      </PageContainer>
    </AuthGuard>
  )
}
