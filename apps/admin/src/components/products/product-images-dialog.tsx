'use client'

import type { MediaDto, Product, ProductImage } from '@app/sdk'
import {
  useAddProductImage,
  useDeleteProductImage,
  useGetProduct,
} from '@app/sdk'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@app/theme'
import { Field } from '@app/theme'
import { toaster } from '@app/theme'
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

import { MediaUpload } from '../media-upload'

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
  const [media, setMedia] = useState<MediaDto | null>(null)
  const [altText, setAltText] = useState('')
  const [position, setPosition] = useState('0')

  const { data: productData, refetch } = useGetProduct(product?.id ?? '', {
    query: { enabled: open && !!product?.id },
  })

  const images = (productData?.images ?? []) as ProductImage[]

  const addImage = useAddProductImage()
  const deleteImage = useDeleteProductImage()

  useEffect(() => {
    if (open && product) refetch()
  }, [open, product, refetch])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()

    if (!product || !media) return

    addImage.mutate(
      {
        id: product.id,
        data: {
          mediaId: media.id,
          altText: altText || undefined,
          position: parseInt(position),
        },
      },
      {
        onSuccess: () => {
          toaster.success({ title: t('imageAdded') })
          setShowForm(false)
          setMedia(null)
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
      { id: product.id, imageId },
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
                <Table.ColumnHeader>{t('selectImage')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('altText')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('position')}</Table.ColumnHeader>
                <Table.ColumnHeader>{tc('actions')}</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {images.map((img) => {
                const sizes = img.media?.sizes as
                  | Record<string, { url?: string | null }>
                  | undefined
                const thumbUrl = sizes?.['thumbnail']?.url ?? img.media?.url

                return (
                  <Table.Row key={img.id}>
                    <Table.Cell>
                      {thumbUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumbUrl}
                          alt={img.altText ?? ''}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 4,
                          }}
                        />
                      ) : (
                        '-'
                      )}
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
                )
              })}
            </Table.Body>
          </Table.Root>

          {showForm ? (
            <form onSubmit={handleAdd}>
              <Stack gap={'3'} mt={'4'}>
                <Field label={t('selectImage')}>
                  <MediaUpload value={media} onChange={setMedia} />
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
                    disabled={!media}
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
