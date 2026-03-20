'use client'

import { useOrder } from '@app/sdk'
import {
  Badge,
  Card,
  Heading,
  HStack,
  Spinner,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { AuthGuard } from '@/components/auth-guard'
import { PageContainer } from '@/components/page-container'

const statusColor: Record<string, string> = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  PROCESSING: 'blue',
  SHIPPED: 'purple',
  DELIVERED: 'green',
  CANCELLED: 'red',
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()

  const { data: order, isLoading } = useOrder(params.id)

  if (isLoading) {
    return (
      <AuthGuard>
        <PageContainer>
          <Spinner size={'xl'} />
        </PageContainer>
      </AuthGuard>
    )
  }

  if (!order) {
    return (
      <AuthGuard>
        <PageContainer>
          <Text>Order not found.</Text>
        </PageContainer>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <PageContainer>
        <VStack align={'stretch'} gap={'6'}>
          <HStack justify={'space-between'} flexWrap={'wrap'} gap={'4'}>
            <VStack align={'flex-start'} gap={'1'}>
              <Heading size={'xl'}>Order #{order.id.slice(0, 8)}</Heading>
              <Text color={'fg.muted'}>
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </VStack>
            <Badge
              colorPalette={statusColor[order.status] || 'gray'}
              size={'lg'}
            >
              {order.status}
            </Badge>
          </HStack>

          <Card.Root>
            <Card.Header>
              <Heading size={'md'}>Items</Heading>
            </Card.Header>
            <Card.Body p={'0'}>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Product</Table.ColumnHeader>
                    <Table.ColumnHeader>Variant</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign={'right'}>
                      Qty
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign={'right'}>
                      Price
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign={'right'}>
                      Subtotal
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {order.items?.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>
                        {item.product ? (
                          <Link href={`/products/${item.product.slug}`}>
                            <Text
                              color={'blue.fg'}
                              _hover={{ textDecoration: 'underline' }}
                            >
                              {item.product.name}
                            </Text>
                          </Link>
                        ) : (
                          'Product'
                        )}
                      </Table.Cell>
                      <Table.Cell>{item.variant?.name || '—'}</Table.Cell>
                      <Table.Cell textAlign={'right'}>
                        {item.quantity}
                      </Table.Cell>
                      <Table.Cell textAlign={'right'}>
                        ${Number(item.unitPrice).toFixed(2)}
                      </Table.Cell>
                      <Table.Cell textAlign={'right'}>
                        ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Card.Body>
            <Card.Footer>
              <HStack justify={'flex-end'} w={'full'}>
                <Text fontWeight={'bold'} fontSize={'lg'}>
                  Total: ${Number(order.totalAmount).toFixed(2)}
                </Text>
              </HStack>
            </Card.Footer>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Heading size={'md'}>Shipping Address</Heading>
            </Card.Header>
            <Card.Body>
              <Text>{order.shippingAddress.street}</Text>
              <Text>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </Text>
              <Text>{order.shippingAddress.country}</Text>
            </Card.Body>
          </Card.Root>
        </VStack>
      </PageContainer>
    </AuthGuard>
  )
}
