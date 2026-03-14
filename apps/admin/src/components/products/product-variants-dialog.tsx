'use client'

import {
  Button,
  HStack,
  IconButton,
  Input,
  Stack,
  Table,
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('products')
  const tc = useTranslations('common')
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
      toaster.error({ title: t('loadVariantsFailed') })
    }
  }, [product, t])

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
      toaster.success({ title: t('variantAdded') })
      setShowForm(false)
      setName('')
      setSku('')
      setPrice('')
      setCompareAtPrice('')
      setStock('0')
      fetch()
      onSaved()
    } catch {
      toaster.error({ title: t('addVariantFailed') })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (variantId: string) => {
    if (!product) return

    try {
      await productsApi.deleteVariant(product.id, variantId)
      toaster.success({ title: t('variantDeleted') })
      fetch()
      onSaved()
    } catch {
      toaster.error({ title: tc('deleteFailed') })
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
          <DialogTitle>
            {t('variantsFor', { name: product?.name ?? '' })}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Table.Root size={'sm'} variant={'outline'}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>{tc('name')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('sku')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('price')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('compareAt')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('stock')}</Table.ColumnHeader>
                <Table.ColumnHeader>{tc('actions')}</Table.ColumnHeader>
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
                      aria-label={tc('delete')}
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
                  <Field label={tc('name')}>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label={t('sku')}>
                    <Input
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      required
                    />
                  </Field>
                </HStack>
                <HStack gap={'3'}>
                  <Field label={t('price')}>
                    <Input
                      type={'number'}
                      step={'0.01'}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label={t('compareAtPrice')}>
                    <Input
                      type={'number'}
                      step={'0.01'}
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                    />
                  </Field>
                  <Field label={t('stock')}>
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
                    {t('addVariant')}
                  </Button>
                  <Button
                    variant={'outline'}
                    size={'sm'}
                    onClick={() => setShowForm(false)}
                  >
                    {tc('cancel')}
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
              {t('addVariant')}
            </Button>
          )}
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
