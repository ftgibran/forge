'use client'

import { useCheckout, useClearCart, useGetCart } from '@app/sdk'
import { Field } from '@app/theme'
import { toaster } from '@app/theme'
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
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { AuthGuard } from '@/components/AuthGuard'
import { PageContainer } from '@/components/PageContainer'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: cart } = useGetCart()
  const clearCartMutation = useClearCart()
  const t = useTranslations('checkout')
  const tc = useTranslations('common')
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })

  const subtotal =
    cart?.items?.reduce((sum, item) => {
      const price = Number(item.variant?.price ?? 0)

      return sum + price * item.quantity
    }, 0) ?? 0

  const checkoutMutation = useCheckout({
    mutation: {
      onSuccess: async () => {
        await clearCartMutation.mutateAsync()
        toaster.success({
          title: t('orderPlaced'),
          description: t('orderPlacedDescription'),
        })
        router.push('/orders')
      },
      onError: () => {
        toaster.error({ title: t('checkoutFailed') })
      },
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    checkoutMutation.mutate({ data: { shippingAddress: address } })
  }

  return (
    <AuthGuard>
      <PageContainer>
        <Heading size={'xl'} mb={'6'}>
          {t('heading')}
        </Heading>

        <form onSubmit={handleSubmit}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 350px' }} gap={'8'}>
            <GridItem>
              <Card.Root>
                <Card.Header>
                  <Heading size={'md'}>{t('shippingAddress')}</Heading>
                </Card.Header>
                <Card.Body>
                  <Stack gap={'4'}>
                    <Field label={t('streetLabel')}>
                      <Input
                        value={address.street}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, street: e.target.value }))
                        }
                        required
                      />
                    </Field>
                    <HStack gap={'4'}>
                      <Field label={t('cityLabel')}>
                        <Input
                          value={address.city}
                          onChange={(e) =>
                            setAddress((a) => ({ ...a, city: e.target.value }))
                          }
                          required
                        />
                      </Field>
                      <Field label={t('stateLabel')}>
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
                      <Field label={t('zipCodeLabel')}>
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
                      <Field label={t('countryLabel')}>
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
                  <Heading size={'md'}>{t('orderSummary')}</Heading>
                </Card.Header>
                <Card.Body>
                  <VStack align={'stretch'} gap={'3'}>
                    {cart?.items?.map((item) => (
                      <HStack key={item.id} justify={'space-between'}>
                        <Text fontSize={'sm'} lineClamp={1} flex={'1'}>
                          {item.variant?.product?.name || tc('product')} x{' '}
                          {item.quantity}
                        </Text>
                        <Text fontSize={'sm'} fontWeight={'medium'}>
                          $
                          {(
                            Number(item.variant?.price ?? 0) * item.quantity
                          ).toFixed(2)}
                        </Text>
                      </HStack>
                    ))}
                    <Separator />
                    <HStack justify={'space-between'}>
                      <Text fontWeight={'bold'}>{t('total')}</Text>
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
                    loading={checkoutMutation.isPending}
                    disabled={!cart?.items?.length}
                  >
                    {t('placeOrder')}
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
