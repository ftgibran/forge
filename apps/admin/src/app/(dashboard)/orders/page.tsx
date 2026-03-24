'use client'

import type { Order } from '@app/sdk'
import { useGetOrders } from '@app/sdk'
import { formatDate } from '@app/utils'
import { Badge, HStack, IconButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { LuEye } from 'react-icons/lu'

import { DataTable } from '@/components/DataTable'
import { OrderDetailDialog } from '@/components/orders/OrderDetailDialog'
import { PageHeader } from '@/components/PageHeader'
import { TableSkeleton } from '@/components/TableSkeleton'

const statusColor: Record<string, string> = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  PROCESSING: 'purple',
  SHIPPED: 'cyan',
  DELIVERED: 'green',
  CANCELLED: 'red',
}

export default function OrdersPage() {
  const t = useTranslations('orders')
  const tc = useTranslations('common')

  const [page, setPage] = useState(1)

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null)

  const limit = 10

  const { data, isLoading } = useGetOrders({ page, limit })

  const orders = data?.items ?? []
  const total = data?.total ?? 0

  const columns = [
    {
      header: t('orderId'),
      accessor: (o: Order) => o.id.slice(0, 8) + '...',
    },
    {
      header: t('customer'),
      accessor: (o: Order) => o.user?.name ?? '-',
    },
    {
      header: t('vendor'),
      accessor: (o: Order) => o.vendor?.name ?? '-',
    },
    {
      header: tc('status'),
      accessor: (o: Order) => (
        <Badge colorPalette={statusColor[o.status]} size={'sm'}>
          {o.status}
        </Badge>
      ),
    },
    {
      header: t('total'),
      accessor: (o: Order) => `$${Number(o.totalAmount).toFixed(2)}`,
    },
    {
      header: tc('created'),
      accessor: (o: Order) => formatDate(o.createdAt),
    },
    {
      header: tc('actions'),
      accessor: (o: Order) => (
        <HStack gap={'1'}>
          <IconButton
            aria-label={t('view')}
            size={'xs'}
            variant={'ghost'}
            onClick={() => {
              setDetailOrderId(o.id)
              setDetailOpen(true)
            }}
          >
            <LuEye />
          </IconButton>
        </HStack>
      ),
    },
  ]

  return (
    <>
      <PageHeader title={t('title')} />

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
        />
      )}

      <OrderDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        orderId={detailOrderId}
        onSaved={() => {}}
      />
    </>
  )
}
