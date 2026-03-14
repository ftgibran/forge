'use client'

import { formatDate } from '@app/utils'
import { Badge, HStack, IconButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { LuEye } from 'react-icons/lu'

import { DataTable } from '@/components/data-table'
import { OrderDetailDialog } from '@/components/orders/order-detail-dialog'
import { PageHeader } from '@/components/page-header'
import { TableSkeleton } from '@/components/table-skeleton'
import { toaster } from '@/components/ui/toaster'
import { ordersApi } from '@/lib/api/orders'
import type { Order } from '@/types'

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
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null)

  const limit = 10

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await ordersApi.list(page, limit)

      setOrders(res.items)
      setTotal(res.total)
    } catch {
      toaster.error({ title: t('loadFailed') })
    } finally {
      setLoading(false)
    }
  }, [page, t])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

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

      {loading ? (
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
        onSaved={fetchOrders}
      />
    </>
  )
}
