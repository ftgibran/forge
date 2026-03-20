'use client'

import type { Product, ProductImage } from '@app/sdk'
import { useAddProductImage, useDeleteProductImage, useProduct } from '@app/sdk'
import {
  Button,
  HStack,
  IconButton,
  Input,
  Stack,
  Table,
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
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

interface ProductImagesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSaved: () => void
}

export function ProductImagesDialog({
  open,
  onOpenChange,
  product,
  onSaved,
}: ProductImagesDialogProps) {
  const t = useTranslations('products')
  const tc = useTranslations('common')
  const [showForm, setShowForm] = useState(false)
  const [url, setUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [position, setPosition] = useState('0')

  const { data: productData, refetch } = useProduct(product?.id ?? '', {
    enabled: open && !!product?.id,
  })

  const images: ProductImage[] = productData?.images ?? []

  const addImage = useAddProductImage()
  const deleteImage = useDeleteProductImage()

  useEffect(() => {
    if (open && product) refetch()
  }, [open, product, refetch])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()

    if (!product) return

    addImage.mutate(
      {
        productId: product.id,
        data: {
          url,
          altText: altText || undefined,
          position: parseInt(position),
        },
      },
      {
        onSuccess: () => {
          toaster.success({ title: t('imageAdded') })
          setShowForm(false)
          setUrl('')
          setAltText('')
          setPosition('0')
          refetch()
          onSaved()
        },
        onError: () => {
          toaster.error({ title: t('addImageFailed') })
        },
      },
    )
  }

  const handleDelete = (imageId: string) => {
    if (!product) return

    deleteImage.mutate(
      { productId: product.id, imageId },
      {
        onSuccess: () => {
          toaster.success({ title: t('imageDeleted') })
          refetch()
          onSaved()
        },
        onError: () => {
          toaster.error({ title: tc('deleteFailed') })
        },
      },
    )
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
            {t('imagesFor', { name: product?.name ?? '' })}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Table.Root size={'sm'} variant={'outline'}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>{t('url')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('altText')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('position')}</Table.ColumnHeader>
                <Table.ColumnHeader>{tc('actions')}</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {images.map((img) => (
                <Table.Row key={img.id}>
                  <Table.Cell maxW={'300px'} truncate>
                    {img.url}
                  </Table.Cell>
                  <Table.Cell>{img.altText ?? '-'}</Table.Cell>
                  <Table.Cell>{img.position}</Table.Cell>
                  <Table.Cell>
                    <IconButton
                      aria-label={tc('delete')}
                      size={'xs'}
                      variant={'ghost'}
                      colorPalette={'red'}
                      onClick={() => handleDelete(img.id)}
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
                <Field label={t('imageUrl')}>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </Field>
                <HStack gap={'3'}>
                  <Field label={t('altText')}>
                    <Input
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                    />
                  </Field>
                  <Field label={t('position')}>
                    <Input
                      type={'number'}
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </Field>
                </HStack>
                <HStack>
                  <Button
                    type={'submit'}
                    colorPalette={'blue'}
                    size={'sm'}
                    loading={addImage.isPending}
                  >
                    {t('addImage')}
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
              {t('addImage')}
            </Button>
          )}
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
