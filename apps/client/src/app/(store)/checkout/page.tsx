'use client'

import {
  Button,
  Card,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Separator,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { AuthGuard } from '@/components/auth-guard'
import { PageContainer } from '@/components/page-container'
import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'
import { ordersApi } from '@/lib/api/orders'
import { useCart } from '@/lib/cart-context'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })

  const subtotal =
    cart?.items?.reduce((sum, item) => {
      const price = item.variant?.price ?? 0

      return sum + price * item.quantity
    }, 0) ?? 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await ordersApi.checkout({ shippingAddress: address })
      await clearCart()
      toaster.success({
        title: 'Order placed!',
        description: 'Your order has been placed successfully.',
      })
      router.push('/orders')
    } catch {
      toaster.error({ title: 'Checkout failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <PageContainer>
        <Heading size={'xl'} mb={'6'}>
          Checkout
        </Heading>

        <form onSubmit={handleSubmit}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 350px' }} gap={'8'}>
            <GridItem>
              <Card.Root>
                <Card.Header>
                  <Heading size={'md'}>Shipping Address</Heading>
                </Card.Header>
                <Card.Body>
                  <Stack gap={'4'}>
                    <Field label={'Street'}>
                      <Input
                        value={address.street}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, street: e.target.value }))
                        }
                        required
                      />
                    </Field>
                    <HStack gap={'4'}>
                      <Field label={'City'}>
                        <Input
                          value={address.city}
                          onChange={(e) =>
                            setAddress((a) => ({ ...a, city: e.target.value }))
                          }
                          required
                        />
                      </Field>
                      <Field label={'State'}>
                        <Input
                          value={address.state}
                          onChange={(e) =>
                            setAddress((a) => ({
                              ...a,
                              state: e.target.value,
                            }))
                          }
                          required
                        />
                      </Field>
                    </HStack>
                    <HStack gap={'4'}>
                      <Field label={'Zip Code'}>
                        <Input
                          value={address.zipCode}
                          onChange={(e) =>
                            setAddress((a) => ({
                              ...a,
                              zipCode: e.target.value,
                            }))
                          }
                          required
                        />
                      </Field>
                      <Field label={'Country'}>
                        <Input
                          value={address.country}
                          onChange={(e) =>
                            setAddress((a) => ({
                              ...a,
                              country: e.target.value,
                            }))
                          }
                          required
                        />
                      </Field>
                    </HStack>
                  </Stack>
                </Card.Body>
              </Card.Root>
            </GridItem>

            <GridItem>
              <Card.Root>
                <Card.Header>
                  <Heading size={'md'}>Order Summary</Heading>
                </Card.Header>
                <Card.Body>
                  <VStack align={'stretch'} gap={'3'}>
                    {cart?.items?.map((item) => (
                      <HStack key={item.id} justify={'space-between'}>
                        <Text fontSize={'sm'} lineClamp={1} flex={'1'}>
                          {item.variant?.product?.name || 'Product'} x{' '}
                          {item.quantity}
                        </Text>
                        <Text fontSize={'sm'} fontWeight={'medium'}>
                          $
                          {((item.variant?.price ?? 0) * item.quantity).toFixed(
                            2,
                          )}
                        </Text>
                      </HStack>
                    ))}
                    <Separator />
                    <HStack justify={'space-between'}>
                      <Text fontWeight={'bold'}>Total</Text>
                      <Text fontWeight={'bold'} fontSize={'lg'}>
                        ${subtotal.toFixed(2)}
                      </Text>
                    </HStack>
                  </VStack>
                </Card.Body>
                <Card.Footer>
                  <Button
                    type={'submit'}
                    colorPalette={'blue'}
                    w={'full'}
                    loading={loading}
                    disabled={!cart?.items?.length}
                  >
                    Place Order
                  </Button>
                </Card.Footer>
              </Card.Root>
            </GridItem>
          </Grid>
        </form>
      </PageContainer>
    </AuthGuard>
  )
}
