'use client'

import {
  Button,
  HStack,
  IconButton,
  Input,
  Stack,
  Table,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { LuPlus, LuTrash2 } from 'react-icons/lu'

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'
import { productsApi } from '@/lib/api/products'
import type { Product, ProductVariant } from '@/types'

interface ProductVariantsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSaved: () => void
}

export function ProductVariantsDialog({
  open,
  onOpenChange,
  product,
  onSaved,
}: ProductVariantsDialogProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('')
  const [compareAtPrice, setCompareAtPrice] = useState('')
  const [stock, setStock] = useState('0')
  const [saving, setSaving] = useState(false)

  const fetch = useCallback(async () => {
    if (!product) return

    try {
      const p = await productsApi.get(product.id)

      setVariants(p.variants ?? [])
    } catch {
      toaster.error({ title: 'Failed to load variants' })
    }
  }, [product])

  useEffect(() => {
    if (open && product) fetch()
  }, [open, product, fetch])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!product) return

    setSaving(true)
    try {
      await productsApi.addVariant(product.id, {
        name,
        sku,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
        stock: parseInt(stock),
      })
      toaster.success({ title: 'Variant added' })
      setShowForm(false)
      setName('')
      setSku('')
      setPrice('')
      setCompareAtPrice('')
      setStock('0')
      fetch()
      onSaved()
    } catch {
      toaster.error({ title: 'Failed to add variant' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (variantId: string) => {
    if (!product) return

    try {
      await productsApi.deleteVariant(product.id, variantId)
      toaster.success({ title: 'Variant deleted' })
      fetch()
      onSaved()
    } catch {
      toaster.error({ title: 'Delete failed' })
    }
  }

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      size={'xl'}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Variants - {product?.name}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Table.Root size={'sm'} variant={'outline'}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>SKU</Table.ColumnHeader>
                <Table.ColumnHeader>Price</Table.ColumnHeader>
                <Table.ColumnHeader>Compare At</Table.ColumnHeader>
                <Table.ColumnHeader>Stock</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {variants.map((v) => (
                <Table.Row key={v.id}>
                  <Table.Cell>{v.name}</Table.Cell>
                  <Table.Cell>{v.sku}</Table.Cell>
                  <Table.Cell>${Number(v.price).toFixed(2)}</Table.Cell>
                  <Table.Cell>
                    {v.compareAtPrice
                      ? `$${Number(v.compareAtPrice).toFixed(2)}`
                      : '-'}
                  </Table.Cell>
                  <Table.Cell>{v.stock}</Table.Cell>
                  <Table.Cell>
                    <IconButton
                      aria-label={'Delete'}
                      size={'xs'}
                      variant={'ghost'}
                      colorPalette={'red'}
                      onClick={() => handleDelete(v.id)}
                    >
                      <LuTrash2 />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {showForm ? (
            <form onSubmit={handleAdd}>
              <Stack gap={'3'} mt={'4'}>
                <HStack gap={'3'}>
                  <Field label={'Name'}>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label={'SKU'}>
                    <Input
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      required
                    />
                  </Field>
                </HStack>
                <HStack gap={'3'}>
                  <Field label={'Price'}>
                    <Input
                      type={'number'}
                      step={'0.01'}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label={'Compare At Price'}>
                    <Input
                      type={'number'}
                      step={'0.01'}
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                    />
                  </Field>
                  <Field label={'Stock'}>
                    <Input
                      type={'number'}
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </Field>
                </HStack>
                <HStack>
                  <Button
                    type={'submit'}
                    colorPalette={'blue'}
                    size={'sm'}
                    loading={saving}
                  >
                    Add Variant
                  </Button>
                  <Button
                    variant={'outline'}
                    size={'sm'}
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </HStack>
              </Stack>
            </form>
          ) : (
            <Button
              mt={'4'}
              size={'sm'}
              variant={'outline'}
              onClick={() => setShowForm(true)}
            >
              <LuPlus />
              Add Variant
            </Button>
          )}
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
