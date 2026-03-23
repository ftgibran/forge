'use client'

import type { Product } from '@app/sdk'
import {
  useDeleteProduct,
  useGetCategories,
  useGetProducts,
  useGetVendors,
} from '@app/sdk'
import { toaster } from '@app/theme'
import { formatDate } from '@app/utils'
import { Badge, Button, HStack, IconButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { LuImage, LuLayers, LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { ProductFormDialog } from '@/components/products/product-form-dialog'
import { ProductImagesDialog } from '@/components/products/product-images-dialog'
import { ProductVariantsDialog } from '@/components/products/product-variants-dialog'
import { TableSkeleton } from '@/components/table-skeleton'

const statusColor: Record<string, string> = {
  DRAFT: 'gray',
  ACTIVE: 'green',
  ARCHIVED: 'orange',
}

export default function ProductsPage() {
  const t = useTranslations('products')
  const tc = useTranslations('common')

  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const [variantsOpen, setVariantsOpen] = useState(false)
  const [variantsTarget, setVariantsTarget] = useState<Product | null>(null)

  const [imagesOpen, setImagesOpen] = useState(false)
  const [imagesTarget, setImagesTarget] = useState<Product | null>(null)

  const limit = 10

  const { data: productsData, isLoading } = useGetProducts({ page, limit })
  const { data: rawCategories } = useGetCategories()
  const { data: vendorsData } = useGetVendors({ page: 1, limit: 100 })

  const products = productsData?.items ?? []
  const total = productsData?.total ?? 0
  const categories = rawCategories ?? []
  const vendors = vendorsData?.items ?? []

  const deleteMutation = useDeleteProduct()

  const handleDelete = () => {
    if (!deleteTarget) return

    deleteMutation.mutate(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          toaster.success({ title: t('productDeleted') })
          setDeleteOpen(false)
        },
        onError: () => {
          toaster.error({ title: tc('deleteFailed') })
        },
      },
    )
  }

  const columns = [
    { header: tc('name'), accessor: (p: Product) => p.name },
    {
      header: t('vendor'),
      accessor: (p: Product) => p.vendor?.name ?? '-',
    },
    {
      header: t('category'),
      accessor: (p: Product) => p.category?.name ?? '-',
    },
    {
      header: tc('status'),
      accessor: (p: Product) => (
        <Badge colorPalette={statusColor[p.status]} size={'sm'}>
          {p.status}
        </Badge>
      ),
    },
    {
      header: t('variants'),
      accessor: (p: Product) => p._count?.variants ?? 0,
    },
    {
      header: tc('created'),
      accessor: (p: Product) => formatDate(p.createdAt),
    },
    {
      header: tc('actions'),
      accessor: (p: Product) => (
        <HStack gap={'1'}>
          <IconButton
            aria-label={tc('edit')}
            size={'xs'}
            variant={'ghost'}
            onClick={() => {
              setEditProduct(p)
              setFormOpen(true)
            }}
          >
            <LuPencil />
          </IconButton>
          <IconButton
            aria-label={t('variants')}
            size={'xs'}
            variant={'ghost'}
            onClick={() => {
              setVariantsTarget(p)
              setVariantsOpen(true)
            }}
          >
            <LuLayers />
          </IconButton>
          <IconButton
            aria-label={t('images')}
            size={'xs'}
            variant={'ghost'}
            onClick={() => {
              setImagesTarget(p)
              setImagesOpen(true)
            }}
          >
            <LuImage />
          </IconButton>
          <IconButton
            aria-label={tc('delete')}
            size={'xs'}
            variant={'ghost'}
            colorPalette={'red'}
            onClick={() => {
              setDeleteTarget(p)
              setDeleteOpen(true)
            }}
          >
            <LuTrash2 />
          </IconButton>
        </HStack>
      ),
    },
  ]

  return (
    <>
      <PageHeader title={t('title')}>
        <Button
          colorPalette={'blue'}
          size={'sm'}
          onClick={() => {
            setEditProduct(null)
            setFormOpen(true)
          }}
        >
          <LuPlus />
          {t('createProduct')}
        </Button>
      </PageHeader>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={products}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
        />
      )}

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editProduct}
        categories={categories}
        vendors={vendors}
        onSaved={() => {}}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('deleteProduct')}
        description={tc('deleteConfirm', { name: deleteTarget?.name ?? '' })}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />

      <ProductVariantsDialog
        open={variantsOpen}
        onOpenChange={setVariantsOpen}
        product={variantsTarget}
        onSaved={() => {}}
      />

      <ProductImagesDialog
        open={imagesOpen}
        onOpenChange={setImagesOpen}
        product={imagesTarget}
        onSaved={() => {}}
      />
    </>
  )
}
