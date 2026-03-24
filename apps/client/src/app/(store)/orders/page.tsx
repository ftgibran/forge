'use client'

import { useGetMyOrders } from '@app/sdk'
import {
  Badge,
  Button,
  Card,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { LuPackage } from 'react-icons/lu'

import { AuthGuard } from '@/components/AuthGuard'
import { EmptyState } from '@/components/EmptyState'
import { PageContainer } from '@/components/PageContainer'

const statusColor: Record<string, string> = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  PROCESSING: 'blue',
  SHIPPED: 'purple',
  DELIVERED: 'green',
  CANCELLED: 'red',
}

export default function OrdersPage() {
  const [page, setPage] = useState(1)
  const t = useTranslations('orders')
  const tc = useTranslations('common')

  const { data, isLoading } = useGetMyOrders({ page, limit: 10 })

  const orders = data?.items ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <AuthGuard>
      <PageContainer>
        <Heading size={'xl'} mb={'6'}>
          {t('heading')}
        </Heading>

        {!isLoading && orders.length === 0 ? (
          <EmptyState
            icon={<LuPackage size={48} />}
            title={t('emptyTitle')}
            description={t('emptyDescription')}
            actionLabel={t('browseProducts')}
            actionHref={'/products'}
          />
        ) : (
          <VStack align={'stretch'} gap={'4'}>
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card.Root
                  _hover={{ shadow: 'md' }}
                  transition={'all 0.2s'}
                  cursor={'pointer'}
                >
                  <Card.Body>
                    <HStack
                      justify={'space-between'}
                      flexWrap={'wrap'}
                      gap={'2'}
                    >
                      <VStack align={'flex-start'} gap={'1'}>
                        <Text fontWeight={'medium'}>
                          {t('orderNumber', { id: order.id.slice(0, 8) })}
                        </Text>
                        <Text fontSize={'sm'} color={'fg.muted'}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Text>
                      </VStack>
                      <HStack gap={'4'}>
                        <Badge
                          colorPalette={statusColor[order.status] || 'gray'}
                        >
                          {order.status}
                        </Badge>
                        <Text fontWeight={'bold'}>
                          ${Number(order.totalAmount).toFixed(2)}
                        </Text>
                        {order._count && (
                          <Text fontSize={'sm'} color={'fg.muted'}>
                            {t('itemsCount', { count: order._count.items })}
                          </Text>
                        )}
                      </HStack>
                    </HStack>
                  </Card.Body>
                </Card.Root>
              </Link>
            ))}

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
          </VStack>
        )}
      </PageContainer>
    </AuthGuard>
  )
}
