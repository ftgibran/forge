'use client'

import { useGetCart, useRemoveCartItem, useUpdateCartItem } from '@app/sdk'
import { toaster } from '@app/theme'
import { Grid, GridItem, Heading, VStack } from '@chakra-ui/react'
import { LuShoppingCart } from 'react-icons/lu'

import { AuthGuard } from '@/components/auth-guard'
import { CartItem } from '@/components/cart/cart-item'
import { CartSummary } from '@/components/cart/cart-summary'
import { EmptyState } from '@/components/empty-state'
import { PageContainer } from '@/components/page-container'

export default function CartPage() {
  const { data: cart } = useGetCart()
  const updateCartItemMutation = useUpdateCartItem()
  const removeCartItemMutation = useRemoveCartItem()

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateCartItemMutation.mutateAsync({ itemId, data: { quantity } })
    } catch {
      toaster.error({ title: 'Failed to update quantity' })
    }
  }

  const handleRemove = async (itemId: string) => {
    try {
      await removeCartItemMutation.mutateAsync({ itemId })
      toaster.success({ title: 'Item removed' })
    } catch {
      toaster.error({ title: 'Failed to remove item' })
    }
  }

  return (
    <AuthGuard>
      <PageContainer>
        <Heading size={'xl'} mb={'6'}>
          Shopping Cart
        </Heading>

        {!cart?.items || cart.items.length === 0 ? (
          <EmptyState
            icon={<LuShoppingCart size={48} />}
            title={'Your cart is empty'}
            description={'Browse our products and add items to your cart.'}
            actionLabel={'Browse Products'}
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
