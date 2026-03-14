'use client'

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
import { categoriesApi } from '@/lib/api/categories'
import type { Category } from '@/types'

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
        toaster.success({ title: t('categoryUpdated') })
      } else {
        await categoriesApi.create(data)
        toaster.success({ title: t('categoryCreated') })
      }

      onOpenChange(false)
      onSaved()
    } catch {
      toaster.error({
        title: category ? tc('updateFailed') : tc('createFailed'),
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
