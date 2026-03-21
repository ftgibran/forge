'use client'

import type { UpdateOrderStatusDtoStatus } from '@app/sdk'
import { useGetOrder, useUpdateOrderStatus } from '@app/sdk'
import { Badge, Button, HStack, Stack, Table, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import {
  NativeSelectField,
  NativeSelectRoot,
} from '@/components/ui/native-select'
import { toaster } from '@/components/ui/toaster'

interface OrderDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string | null
  onSaved: () => void
}

const statusColor: Record<string, string> = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  PROCESSING: 'purple',
  SHIPPED: 'cyan',
  DELIVERED: 'green',
  CANCELLED: 'red',
}

const statuses = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]

export function OrderDetailDialog({
  open,
  onOpenChange,
  orderId,
  onSaved,
}: OrderDetailDialogProps) {
  const t = useTranslations('orders')
  const tc = useTranslations('common')
  const [newStatus, setNewStatus] = useState('')

  const { data: order, refetch } = useGetOrder(orderId ?? '', {
    query: { enabled: open && !!orderId },
  })

  const updateStatus = useUpdateOrderStatus()

  useEffect(() => {
    if (order) {
      setNewStatus(order.status)
    }
  }, [order])

  const handleUpdateStatus = () => {
    if (!orderId || !newStatus) return

    updateStatus.mutate(
      {
        id: orderId,
        data: { status: newStatus as UpdateOrderStatusDtoStatus },
      },
      {
        onSuccess: () => {
          toaster.success({ title: t('statusUpdated') })
          refetch()
          onSaved()
        },
        onError: () => {
          toaster.error({ title: tc('updateFailed') })
        },
      },
    )
  }

  if (!order) return null

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      size={'xl'}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('orderNumber', { id: order.id.slice(0, 8) })}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Stack gap={'4'}>
            <HStack gap={'4'}>
              <Text fontSize={'sm'}>
                <strong>{t('customer')}:</strong> {order.user?.name}
              </Text>
              <Text fontSize={'sm'}>
                <strong>{t('vendor')}:</strong> {order.vendor?.name}
              </Text>
              <Badge colorPalette={statusColor[order.status]} size={'sm'}>
                {order.status}
              </Badge>
            </HStack>
            <Text fontSize={'sm'}>
              <strong>{t('total')}:</strong> $
              {Number(order.totalAmount).toFixed(2)}
            </Text>
            <Text fontSize={'sm'}>
              <strong>{t('shipTo')}</strong> {order.shippingAddress?.street},{' '}
              {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
              {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}
            </Text>

            <Table.Root size={'sm'} variant={'outline'}>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>{t('product')}</Table.ColumnHeader>
                  <Table.ColumnHeader>{t('variant')}</Table.ColumnHeader>
                  <Table.ColumnHeader>{t('qty')}</Table.ColumnHeader>
                  <Table.ColumnHeader>{t('unitPrice')}</Table.ColumnHeader>
                  <Table.ColumnHeader>{t('subtotal')}</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {order.items?.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.product?.name}</Table.Cell>
                    <Table.Cell>{item.variant?.name}</Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                    <Table.Cell>
                      ${Number(item.unitPrice).toFixed(2)}
                    </Table.Cell>
                    <Table.Cell>
                      ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Stack>
        </DialogBody>
        <DialogFooter>
          <HStack gap={'2'}>
            <Field label={t('updateStatus')}>
              <NativeSelectRoot size={'sm'}>
                <NativeSelectField
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </Field>
            <Button
              colorPalette={'blue'}
              size={'sm'}
              onClick={handleUpdateStatus}
              loading={updateStatus.isPending}
              alignSelf={'flex-end'}
            >
              {tc('update')}
            </Button>
          </HStack>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
