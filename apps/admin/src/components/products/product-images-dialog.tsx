'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Button,
  HStack,
  IconButton,
  Input,
  Stack,
  Table,
} from '@chakra-ui/react'
import { LuPlus, LuTrash2 } from 'react-icons/lu'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'
import { productsApi } from '@/lib/api/products'
import type { Product, ProductImage } from '@/types'

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
  const [images, setImages] = useState<ProductImage[]>([])
  const [showForm, setShowForm] = useState(false)
  const [url, setUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [position, setPosition] = useState('0')
  const [saving, setSaving] = useState(false)

  const fetch = useCallback(async () => {
    if (!product) return
    try {
      const p = await productsApi.get(product.id)
      setImages(p.images ?? [])
    } catch {
      toaster.error({ title: 'Failed to load images' })
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
      await productsApi.addImage(product.id, {
        url,
        altText: altText || undefined,
        position: parseInt(position),
      })
      toaster.success({ title: 'Image added' })
      setShowForm(false)
      setUrl('')
      setAltText('')
      setPosition('0')
      fetch()
      onSaved()
    } catch {
      toaster.error({ title: 'Failed to add image' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!product) return
    try {
      await productsApi.deleteImage(product.id, imageId)
      toaster.success({ title: 'Image deleted' })
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
      size='xl'
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Images - {product?.name}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Table.Root size='sm' variant='outline'>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>URL</Table.ColumnHeader>
                <Table.ColumnHeader>Alt Text</Table.ColumnHeader>
                <Table.ColumnHeader>Position</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {images.map((img) => (
                <Table.Row key={img.id}>
                  <Table.Cell maxW='300px' truncate>
                    {img.url}
                  </Table.Cell>
                  <Table.Cell>{img.altText ?? '-'}</Table.Cell>
                  <Table.Cell>{img.position}</Table.Cell>
                  <Table.Cell>
                    <IconButton
                      aria-label='Delete'
                      size='xs'
                      variant='ghost'
                      colorPalette='red'
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
              <Stack gap='3' mt='4'>
                <Field label='Image URL'>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </Field>
                <HStack gap='3'>
                  <Field label='Alt Text'>
                    <Input
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                    />
                  </Field>
                  <Field label='Position'>
                    <Input
                      type='number'
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </Field>
                </HStack>
                <HStack>
                  <Button
                    type='submit'
                    colorPalette='blue'
                    size='sm'
                    loading={saving}
                  >
                    Add Image
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </HStack>
              </Stack>
            </form>
          ) : (
            <Button
              mt='4'
              size='sm'
              variant='outline'
              onClick={() => setShowForm(true)}
            >
              <LuPlus />
              Add Image
            </Button>
          )}
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
