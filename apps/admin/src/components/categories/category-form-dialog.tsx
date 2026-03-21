'use client'

import type { Category } from '@app/sdk'
import { useCreateCategory, useUpdateCategory } from '@app/sdk'
import { Button, Input, Stack } from '@chakra-ui/react'
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
  const t = useTranslations('categories')
  const tc = useTranslations('common')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [parentId, setParentId] = useState('')

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()

  const loading = createCategory.isPending || updateCategory.isPending

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      name,
      slug,
      description: description || undefined,
      parentId: parentId || undefined,
    }

    if (category) {
      updateCategory.mutate(
        { id: category.id, data },
        {
          onSuccess: () => {
            toaster.success({ title: t('categoryUpdated') })
            onOpenChange(false)
            onSaved()
          },
          onError: () => {
            toaster.error({ title: tc('updateFailed') })
          },
        },
      )
    } else {
      createCategory.mutate(
        { data },
        {
          onSuccess: () => {
            toaster.success({ title: t('categoryCreated') })
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
            {category ? t('editCategory') : t('createCategory')}
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
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
              <Field label={t('parentCategory')}>
                <NativeSelectRoot>
                  <NativeSelectField
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                  >
                    <option value={''}>{t('noneRoot')}</option>
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
            <Button variant={'outline'} onClick={() => onOpenChange(false)}>
              {tc('cancel')}
            </Button>
            <Button type={'submit'} colorPalette={'blue'} loading={loading}>
              {category ? tc('update') : tc('create')}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
