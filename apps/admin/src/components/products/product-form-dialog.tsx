'use client'

import type { Category, Product, Vendor } from '@app/sdk'
import { useCreateProduct, useUpdateProduct } from '@app/sdk'
import { Button, Input, SimpleGrid, Stack, Textarea } from '@chakra-ui/react'
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

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  categories: Category[]
  vendors: Vendor[]
  onSaved: () => void
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  vendors,
  onSaved,
}: ProductFormDialogProps) {
  const t = useTranslations('products')
  const tc = useTranslations('common')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [vendorId, setVendorId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('DRAFT')
  const [filamentType, setFilamentType] = useState('')
  const [printTimeHours, setPrintTimeHours] = useState('')
  const [dimensionX, setDimensionX] = useState('')
  const [dimensionY, setDimensionY] = useState('')
  const [dimensionZ, setDimensionZ] = useState('')
  const [fileFormat, setFileFormat] = useState('')
  const [nozzleSize, setNozzleSize] = useState('')
  const [infillPercentage, setInfillPercentage] = useState('')
  const [supportsRequired, setSupportsRequired] = useState('false')

  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const loading = createProduct.isPending || updateProduct.isPending

  useEffect(() => {
    if (product) {
      setName(product.name)
      setSlug(product.slug)
      setDescription(product.description ?? '')
      setVendorId(product.vendorId)
      setCategoryId(product.categoryId ?? '')
      setStatus(product.status)
      setFilamentType(product.filamentType ?? '')
      setPrintTimeHours(product.printTimeHours?.toString() ?? '')
      setDimensionX(product.dimensionX?.toString() ?? '')
      setDimensionY(product.dimensionY?.toString() ?? '')
      setDimensionZ(product.dimensionZ?.toString() ?? '')
      setFileFormat(product.fileFormat ?? '')
      setNozzleSize(product.nozzleSize?.toString() ?? '')
      setInfillPercentage(product.infillPercentage?.toString() ?? '')
      setSupportsRequired(product.supportsRequired ? 'true' : 'false')
    } else {
      setName('')
      setSlug('')
      setDescription('')
      setVendorId('')
      setCategoryId('')
      setStatus('DRAFT')
      setFilamentType('')
      setPrintTimeHours('')
      setDimensionX('')
      setDimensionY('')
      setDimensionZ('')
      setFileFormat('')
      setNozzleSize('')
      setInfillPercentage('')
      setSupportsRequired('false')
    }
  }, [product, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data: Record<string, unknown> = {
      name,
      slug,
      description: description || undefined,
      vendorId,
      categoryId: categoryId || undefined,
      status,
      filamentType: filamentType || undefined,
      printTimeHours: printTimeHours ? parseFloat(printTimeHours) : undefined,
      dimensionX: dimensionX ? parseFloat(dimensionX) : undefined,
      dimensionY: dimensionY ? parseFloat(dimensionY) : undefined,
      dimensionZ: dimensionZ ? parseFloat(dimensionZ) : undefined,
      fileFormat: fileFormat || undefined,
      nozzleSize: nozzleSize ? parseFloat(nozzleSize) : undefined,
      infillPercentage: infillPercentage
        ? parseInt(infillPercentage)
        : undefined,
      supportsRequired: supportsRequired === 'true',
    }

    if (product) {
      delete data.vendorId
      updateProduct.mutate(
        { id: product.id, data },
        {
          onSuccess: () => {
            toaster.success({ title: t('productUpdated') })
            onOpenChange(false)
            onSaved()
          },
          onError: () => {
            toaster.error({ title: tc('updateFailed') })
          },
        },
      )
    } else {
      createProduct.mutate(data, {
        onSuccess: () => {
          toaster.success({ title: t('productCreated') })
          onOpenChange(false)
          onSaved()
        },
        onError: () => {
          toaster.error({ title: tc('createFailed') })
        },
      })
    }
  }

  const flatCategories = categories.flatMap((c) => {
    const items = [c]

    if (c.children) items.push(...c.children)

    return items
  })

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      size={'xl'}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {product ? t('editProduct') : t('createProduct')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <Stack gap={'4'}>
              <SimpleGrid columns={2} gap={'4'}>
                <Field label={tc('name')}>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>
                <Field label={tc('slug')}>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </Field>
              </SimpleGrid>
              <Field label={tc('description')}>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
              <SimpleGrid columns={3} gap={'4'}>
                {!product && (
                  <Field label={t('vendor')}>
                    <NativeSelectRoot>
                      <NativeSelectField
                        value={vendorId}
                        onChange={(e) => setVendorId(e.target.value)}
                      >
                        <option value={''}>{t('selectVendor')}</option>
                        {vendors.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </Field>
                )}
                <Field label={t('category')}>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option value={''}>{t('none')}</option>
                      {flatCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field>
                <Field label={tc('status')}>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value={'DRAFT'}>{t('draft')}</option>
                      <option value={'ACTIVE'}>{t('active')}</option>
                      <option value={'ARCHIVED'}>{t('archived')}</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field>
              </SimpleGrid>

              <SimpleGrid columns={3} gap={'4'}>
                <Field label={t('filamentType')}>
                  <Input
                    value={filamentType}
                    onChange={(e) => setFilamentType(e.target.value)}
                    placeholder={t('filamentPlaceholder')}
                  />
                </Field>
                <Field label={t('printTimeHours')}>
                  <Input
                    type={'number'}
                    step={'0.1'}
                    value={printTimeHours}
                    onChange={(e) => setPrintTimeHours(e.target.value)}
                  />
                </Field>
                <Field label={t('fileFormat')}>
                  <Input
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    placeholder={t('fileFormatPlaceholder')}
                  />
                </Field>
              </SimpleGrid>
              <SimpleGrid columns={3} gap={'4'}>
                <Field label={t('dimensionX')}>
                  <Input
                    type={'number'}
                    step={'0.1'}
                    value={dimensionX}
                    onChange={(e) => setDimensionX(e.target.value)}
                  />
                </Field>
                <Field label={t('dimensionY')}>
                  <Input
                    type={'number'}
                    step={'0.1'}
                    value={dimensionY}
                    onChange={(e) => setDimensionY(e.target.value)}
                  />
                </Field>
                <Field label={t('dimensionZ')}>
                  <Input
                    type={'number'}
                    step={'0.1'}
                    value={dimensionZ}
                    onChange={(e) => setDimensionZ(e.target.value)}
                  />
                </Field>
              </SimpleGrid>
              <SimpleGrid columns={3} gap={'4'}>
                <Field label={t('nozzleSize')}>
                  <Input
                    type={'number'}
                    step={'0.01'}
                    value={nozzleSize}
                    onChange={(e) => setNozzleSize(e.target.value)}
                  />
                </Field>
                <Field label={t('infillPercentage')}>
                  <Input
                    type={'number'}
                    min={'0'}
                    max={'100'}
                    value={infillPercentage}
                    onChange={(e) => setInfillPercentage(e.target.value)}
                  />
                </Field>
                <Field label={t('supportsRequired')}>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={supportsRequired}
                      onChange={(e) => setSupportsRequired(e.target.value)}
                    >
                      <option value={'false'}>{tc('no')}</option>
                      <option value={'true'}>{tc('yes')}</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field>
              </SimpleGrid>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant={'outline'} onClick={() => onOpenChange(false)}>
              {tc('cancel')}
            </Button>
            <Button type={'submit'} colorPalette={'blue'} loading={loading}>
              {product ? tc('update') : tc('create')}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
