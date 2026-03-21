'use client'

import type { Vendor } from '@app/sdk'
import { useCreateVendor, useUpdateVendor } from '@app/sdk'
import { Button, Input, Stack, Textarea } from '@chakra-ui/react'
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
import { toaster } from '@/components/ui/toaster'

interface VendorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vendor: Vendor | null
  onSaved: () => void
}

export function VendorFormDialog({
  open,
  onOpenChange,
  vendor,
  onSaved,
}: VendorFormDialogProps) {
  const t = useTranslations('vendors')
  const tc = useTranslations('common')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')

  const createVendor = useCreateVendor()
  const updateVendor = useUpdateVendor()

  const loading = createVendor.isPending || updateVendor.isPending

  useEffect(() => {
    if (vendor) {
      setName(vendor.name)
      setSlug(vendor.slug)
      setDescription(vendor.description ?? '')
      setLogoUrl(vendor.logoUrl ?? '')
    } else {
      setName('')
      setSlug('')
      setDescription('')
      setLogoUrl('')
    }
  }, [vendor, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      name,
      slug,
      description: description || undefined,
      logoUrl: logoUrl || undefined,
    }

    if (vendor) {
      updateVendor.mutate(
        { id: vendor.id, data },
        {
          onSuccess: () => {
            toaster.success({ title: t('vendorUpdated') })
            onOpenChange(false)
            onSaved()
          },
          onError: () => {
            toaster.error({ title: tc('updateFailed') })
          },
        },
      )
    } else {
      createVendor.mutate(
        { data },
        {
          onSuccess: () => {
            toaster.success({ title: t('vendorCreated') })
            onOpenChange(false)
            onSaved()
          },
          onError: () => {
            toaster.error({ title: tc('createFailed') })
          },
        },
      )
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {vendor ? t('editVendor') : t('createVendor')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <Stack gap={'4'}>
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
              <Field label={tc('description')}>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
              <Field label={t('logoUrl')}>
                <Input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant={'outline'} onClick={() => onOpenChange(false)}>
              {tc('cancel')}
            </Button>
            <Button type={'submit'} colorPalette={'blue'} loading={loading}>
              {vendor ? tc('update') : tc('create')}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
