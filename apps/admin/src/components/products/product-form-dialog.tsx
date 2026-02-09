'use client'

import { Button, Input, SimpleGrid, Stack, Textarea } from '@chakra-ui/react'
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
import { productsApi } from '@/lib/api/products'
import type { Category, Product, Vendor } from '@/types'

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
  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
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
        await productsApi.update(product.id, data)
        toaster.success({ title: 'Product updated' })
      } else {
        await productsApi.create(data)
        toaster.success({ title: 'Product created' })
      }

      onOpenChange(false)
      onSaved()
    } catch {
      toaster.error({
        title: product ? 'Update failed' : 'Create failed',
      })
    } finally {
      setLoading(false)
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
            {product ? 'Edit Product' : 'Create Product'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <Stack gap={'4'}>
              <SimpleGrid columns={2} gap={'4'}>
                <Field label={'Name'}>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>
                <Field label={'Slug'}>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </Field>
              </SimpleGrid>
              <Field label={'Description'}>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
              <SimpleGrid columns={3} gap={'4'}>
                {!product && (
                  <Field label={'Vendor'}>
                    <NativeSelectRoot>
                      <NativeSelectField
                        value={vendorId}
                        onChange={(e) => setVendorId(e.target.value)}
                      >
                        <option value={''}>Select vendor</option>
                        {vendors.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </Field>
                )}
                <Field label={'Category'}>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option value={''}>None</option>
                      {flatCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field>
                <Field label={'Status'}>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value={'DRAFT'}>Draft</option>
                      <option value={'ACTIVE'}>Active</option>
                      <option value={'ARCHIVED'}>Archived</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field>
              </SimpleGrid>

              <SimpleGrid columns={3} gap={'4'}>
                <Field label={'Filament Type'}>
                  <Input
                    value={filamentType}
                    onChange={(e) => setFilamentType(e.target.value)}
                    placeholder={'PLA, ABS, PETG...'}
                  />
                </Field>
                <Field label={'Print Time (hours)'}>
                  <Input
                    type={'number'}
                    step={'0.1'}
                    value={printTimeHours}
                    onChange={(e) => setPrintTimeHours(e.target.value)}
                  />
                </Field>
                <Field label={'File Format'}>
                  <Input
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    placeholder={'STL, OBJ...'}
                  />
                </Field>
              </SimpleGrid>
              <SimpleGrid columns={3} gap={'4'}>
                <Field label={'Dimension X (mm)'}>
                  <Input
                    type={'number'}
                    step={'0.1'}
                    value={dimensionX}
                    onChange={(e) => setDimensionX(e.target.value)}
                  />
                </Field>
                <Field label={'Dimension Y (mm)'}>
                  <Input
                    type={'number'}
                    step={'0.1'}
                    value={dimensionY}
                    onChange={(e) => setDimensionY(e.target.value)}
                  />
                </Field>
                <Field label={'Dimension Z (mm)'}>
                  <Input
                    type={'number'}
                    step={'0.1'}
                    value={dimensionZ}
                    onChange={(e) => setDimensionZ(e.target.value)}
                  />
                </Field>
              </SimpleGrid>
              <SimpleGrid columns={3} gap={'4'}>
                <Field label={'Nozzle Size (mm)'}>
                  <Input
                    type={'number'}
                    step={'0.01'}
                    value={nozzleSize}
                    onChange={(e) => setNozzleSize(e.target.value)}
                  />
                </Field>
                <Field label={'Infill %'}>
                  <Input
                    type={'number'}
                    min={'0'}
                    max={'100'}
                    value={infillPercentage}
                    onChange={(e) => setInfillPercentage(e.target.value)}
                  />
                </Field>
                <Field label={'Supports Required'}>
                  <NativeSelectRoot>
                    <NativeSelectField
                      value={supportsRequired}
                      onChange={(e) => setSupportsRequired(e.target.value)}
                    >
                      <option value={'false'}>No</option>
                      <option value={'true'}>Yes</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field>
              </SimpleGrid>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant={'outline'} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type={'submit'} colorPalette={'blue'} loading={loading}>
              {product ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
