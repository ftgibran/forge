'use client'

import { formatDate } from '@app/utils'
import { Badge, Button, HStack, IconButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { LuImage, LuLayers, LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { ProductFormDialog } from '@/components/products/product-form-dialog'
import { ProductImagesDialog } from '@/components/products/product-images-dialog'
import { ProductVariantsDialog } from '@/components/products/product-variants-dialog'
import { TableSkeleton } from '@/components/table-skeleton'
import { toaster } from '@/components/ui/toaster'
import { categoriesApi } from '@/lib/api/categories'
import { productsApi } from '@/lib/api/products'
import { vendorsApi } from '@/lib/api/vendors'
import type { Category, Product, Vendor } from '@/types'

const statusColor: Record<string, string> = {
  DRAFT: 'gray',
  ACTIVE: 'green',
  ARCHIVED: 'orange',
}

export default function ProductsPage() {
  const t = useTranslations('products')
  const tc = useTranslations('common')
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const [categories, setCategories] = useState<Category[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])

  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [variantsOpen, setVariantsOpen] = useState(false)
  const [variantsTarget, setVariantsTarget] = useState<Product | null>(null)

  const [imagesOpen, setImagesOpen] = useState(false)
  const [imagesTarget, setImagesTarget] = useState<Product | null>(null)

  const limit = 10

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await productsApi.list({ page, limit })

      setProducts(res.items)
      setTotal(res.total)
    } catch {
      toaster.error({ title: t('loadFailed') })
    } finally {
      setLoading(false)
    }
  }, [page, t])

  useEffect(() => {
    fetchProducts()
    categoriesApi
      .list()
      .then(setCategories)
      .catch(() => {})
    vendorsApi
      .list(1, 100)
      .then((r) => setVendors(r.items))
      .catch(() => {})
  }, [fetchProducts])

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      await productsApi.delete(deleteTarget.id)
      toaster.success({ title: t('productDeleted') })
      setDeleteOpen(false)
      fetchProducts()
    } catch {
      toaster.error({ title: tc('deleteFailed') })
    } finally {
      setDeleting(false)
    }
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

      {loading ? (
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
        onSaved={fetchProducts}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('deleteProduct')}
        description={tc('deleteConfirm', { name: deleteTarget?.name ?? '' })}
        onConfirm={handleDelete}
        loading={deleting}
      />

      <ProductVariantsDialog
        open={variantsOpen}
        onOpenChange={setVariantsOpen}
        product={variantsTarget}
        onSaved={fetchProducts}
      />

      <ProductImagesDialog
        open={imagesOpen}
        onOpenChange={setImagesOpen}
        product={imagesTarget}
        onSaved={fetchProducts}
      />
    </>
  )
}
