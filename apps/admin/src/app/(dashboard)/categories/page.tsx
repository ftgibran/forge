'use client'

import { formatDate } from '@app/utils'
import { Badge, Button, HStack, IconButton } from '@chakra-ui/react'
import { Box, Table } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu'

import { CategoryFormDialog } from '@/components/categories/category-form-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PageHeader } from '@/components/page-header'
import { TableSkeleton } from '@/components/table-skeleton'
import { toaster } from '@/components/ui/toaster'
import { categoriesApi } from '@/lib/api/categories'
import type { Category } from '@/types'

export default function CategoriesPage() {
  const t = useTranslations('categories')
  const tc = useTranslations('common')
  const queryClient = useQueryClient()

  const [formOpen, setFormOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      toaster.success({ title: t('categoryDeleted') })
      setDeleteOpen(false)
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: () => {
      toaster.error({ title: tc('deleteFailed') })
    },
  })

  const handleDelete = () => {
    if (!deleteTarget) return

    deleteMutation.mutate(deleteTarget.id)
  }

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
  }

  // Flatten tree for table display
  const flatRows: (Category & { depth: number })[] = []
  const flatten = (cats: Category[], depth: number) => {
    for (const cat of cats) {
      flatRows.push({ ...cat, depth })

      if (cat.children) flatten(cat.children, depth + 1)
    }
  }

  flatten(categories, 0)

  return (
    <>
      <PageHeader title={t('title')}>
        <Button
          colorPalette={'blue'}
          size={'sm'}
          onClick={() => {
            setEditCategory(null)
            setFormOpen(true)
          }}
        >
          <LuPlus />
          {t('createCategory')}
        </Button>
      </PageHeader>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Box>
          <Table.Root size={'sm'} variant={'outline'} interactive>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>{tc('name')}</Table.ColumnHeader>
                <Table.ColumnHeader>{tc('slug')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('products')}</Table.ColumnHeader>
                <Table.ColumnHeader>{tc('created')}</Table.ColumnHeader>
                <Table.ColumnHeader>{tc('actions')}</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {flatRows.map((cat) => (
                <Table.Row key={cat.id}>
                  <Table.Cell fontWeight={'medium'}>
                    {'  '.repeat(cat.depth)}
                    {cat.depth > 0 && '└ '}
                    {cat.name}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge size={'sm'} variant={'outline'}>
                      {cat.slug}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{cat._count?.products ?? 0}</Table.Cell>
                  <Table.Cell color={'fg.muted'}>
                    {formatDate(cat.createdAt)}
                  </Table.Cell>
                  <Table.Cell>
                    <HStack gap={'1'}>
                      <IconButton
                        aria-label={tc('edit')}
                        size={'xs'}
                        variant={'ghost'}
                        onClick={() => {
                          setEditCategory(cat)
                          setFormOpen(true)
                        }}
                      >
                        <LuPencil />
                      </IconButton>
                      <IconButton
                        aria-label={tc('delete')}
                        size={'xs'}
                        variant={'ghost'}
                        colorPalette={'red'}
                        onClick={() => {
                          setDeleteTarget(cat)
                          setDeleteOpen(true)
                        }}
                      >
                        <LuTrash2 />
                      </IconButton>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editCategory}
        categories={categories}
        onSaved={invalidateCategories}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('deleteCategory')}
        description={tc('deleteConfirm', { name: deleteTarget?.name ?? '' })}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </>
  )
}
