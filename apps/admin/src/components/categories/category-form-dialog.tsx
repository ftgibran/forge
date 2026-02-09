'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Stack } from '@chakra-ui/react'
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
import { categoriesApi } from '@/lib/api/categories'
import type { Category } from '@/types'
import {
  NativeSelectField,
  NativeSelectRoot,
} from '@/components/ui/native-select'

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  categories: Category[]
  onSaved: () => void
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  categories,
  onSaved,
}: CategoryFormDialogProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [parentId, setParentId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category) {
      setName(category.name)
      setSlug(category.slug)
      setDescription(category.description ?? '')
      setParentId(category.parentId ?? '')
    } else {
      setName('')
      setSlug('')
      setDescription('')
      setParentId('')
    }
  }, [category, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = {
        name,
        slug,
        description: description || undefined,
        parentId: parentId || undefined,
      }
      if (category) {
        await categoriesApi.update(category.id, data)
        toaster.success({ title: 'Category updated' })
      } else {
        await categoriesApi.create(data)
        toaster.success({ title: 'Category created' })
      }
      onOpenChange(false)
      onSaved()
    } catch {
      toaster.error({
        title: category ? 'Update failed' : 'Create failed',
      })
    } finally {
      setLoading(false)
    }
  }

  // Flatten categories for parent selector, excluding current category
  const flatCategories = categories
    .flatMap((c) => {
      const items = [c]
      if (c.children) items.push(...c.children)
      return items
    })
    .filter((c) => c.id !== category?.id)

  return (
    <DialogRoot open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Create Category'}
          </DialogTitle>
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
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
              <Field label='Parent Category'>
                <NativeSelectRoot>
                  <NativeSelectField
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                  >
                    <option value=''>None (Root)</option>
                    {flatCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </NativeSelectField>
                </NativeSelectRoot>
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit' colorPalette='blue' loading={loading}>
              {category ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
