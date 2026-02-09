'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Stack, Textarea } from '@chakra-ui/react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'
import { vendorsApi } from '@/lib/api/vendors'
import type { Vendor } from '@/types'

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
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = {
        name,
        slug,
        description: description || undefined,
        logoUrl: logoUrl || undefined,
      }
      if (vendor) {
        await vendorsApi.update(vendor.id, data)
        toaster.success({ title: 'Vendor updated' })
      } else {
        await vendorsApi.create(data)
        toaster.success({ title: 'Vendor created' })
      }
      onOpenChange(false)
      onSaved()
    } catch {
      toaster.error({ title: vendor ? 'Update failed' : 'Create failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{vendor ? 'Edit Vendor' : 'Create Vendor'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <Stack gap='4'>
              <Field label='Name'>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
              <Field label='Slug'>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </Field>
              <Field label='Description'>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
              <Field label='Logo URL'>
                <Input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit' colorPalette='blue' loading={loading}>
              {vendor ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
