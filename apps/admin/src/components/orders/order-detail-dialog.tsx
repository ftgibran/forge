'use client'

import { useCallback, useEffect, useState } from 'react'
import { Badge, Button, HStack, Stack, Table, Text } from '@chakra-ui/react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from '@/components/ui/dialog'
import {
  NativeSelectField,
  NativeSelectRoot,
} from '@/components/ui/native-select'
import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'
import { ordersApi } from '@/lib/api/orders'
import type { Order } from '@/types'

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
  const [order, setOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetch = useCallback(async () => {
    if (!orderId) return
    try {
      const o = await ordersApi.get(orderId)
      setOrder(o)
      setNewStatus(o.status)
    } catch {
      toaster.error({ title: 'Failed to load order' })
    }
  }, [orderId])

  useEffect(() => {
    if (open && orderId) fetch()
  }, [open, orderId, fetch])

  const handleUpdateStatus = async () => {
    if (!orderId || !newStatus) return
    setUpdating(true)
    try {
      await ordersApi.updateStatus(orderId, newStatus)
      toaster.success({ title: 'Status updated' })
      fetch()
      onSaved()
    } catch {
      toaster.error({ title: 'Update failed' })
    } finally {
      setUpdating(false)
    }
  }

  if (!order) return null

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      size='xl'
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order #{order.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Stack gap='4'>
            <HStack gap='4'>
              <Text fontSize='sm'>
                <strong>Customer:</strong> {order.user?.name}
              </Text>
              <Text fontSize='sm'>
                <strong>Vendor:</strong> {order.vendor?.name}
              </Text>
              <Badge colorPalette={statusColor[order.status]} size='sm'>
                {order.status}
              </Badge>
            </HStack>
            <Text fontSize='sm'>
              <strong>Total:</strong> ${Number(order.totalAmount).toFixed(2)}
            </Text>
            <Text fontSize='sm'>
              <strong>Ship to:</strong> {order.shippingAddress?.street},{' '}
              {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
              {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}
            </Text>

            <Table.Root size='sm' variant='outline'>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Product</Table.ColumnHeader>
                  <Table.ColumnHeader>Variant</Table.ColumnHeader>
                  <Table.ColumnHeader>Qty</Table.ColumnHeader>
                  <Table.ColumnHeader>Unit Price</Table.ColumnHeader>
                  <Table.ColumnHeader>Subtotal</Table.ColumnHeader>
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
          <HStack gap='2'>
            <Field label='Update Status'>
              <NativeSelectRoot size='sm'>
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
              colorPalette='blue'
              size='sm'
              onClick={handleUpdateStatus}
              loading={updating}
              alignSelf='flex-end'
            >
              Update
            </Button>
          </HStack>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
