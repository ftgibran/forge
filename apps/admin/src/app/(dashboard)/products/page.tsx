'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button, Badge, HStack, IconButton } from '@chakra-ui/react'
import { LuPlus, LuPencil, LuTrash2, LuLayers, LuImage } from 'react-icons/lu'
import { formatDate } from '@app/utils'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/data-table'
import { TableSkeleton } from '@/components/table-skeleton'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { ProductFormDialog } from '@/components/products/product-form-dialog'
import { ProductVariantsDialog } from '@/components/products/product-variants-dialog'
import { ProductImagesDialog } from '@/components/products/product-images-dialog'
import { productsApi } from '@/lib/api/products'
import { categoriesApi } from '@/lib/api/categories'
import { vendorsApi } from '@/lib/api/vendors'
import { toaster } from '@/components/ui/toaster'
import type { Product, Category, Vendor } from '@/types'

const statusColor: Record<string, string> = {
  DRAFT: 'gray',
  ACTIVE: 'green',
  ARCHIVED: 'orange',
}

export default function ProductsPage() {
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
      toaster.error({ title: 'Failed to load products' })
    } finally {
      setLoading(false)
    }
  }, [page])

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
      toaster.success({ title: 'Product deleted' })
      setDeleteOpen(false)
      fetchProducts()
    } catch {
      toaster.error({ title: 'Delete failed' })
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { header: 'Name', accessor: (p: Product) => p.name },
    {
      header: 'Vendor',
      accessor: (p: Product) => p.vendor?.name ?? '-',
    },
    {
      header: 'Category',
      accessor: (p: Product) => p.category?.name ?? '-',
    },
    {
      header: 'Status',
      accessor: (p: Product) => (
        <Badge colorPalette={statusColor[p.status]} size='sm'>
          {p.status}
        </Badge>
      ),
    },
    {
      header: 'Variants',
      accessor: (p: Product) => p._count?.variants ?? 0,
    },
    {
      header: 'Created',
      accessor: (p: Product) => formatDate(p.createdAt),
    },
    {
      header: 'Actions',
      accessor: (p: Product) => (
        <HStack gap='1'>
          <IconButton
            aria-label='Edit'
            size='xs'
            variant='ghost'
            onClick={() => {
              setEditProduct(p)
              setFormOpen(true)
            }}
          >
            <LuPencil />
          </IconButton>
          <IconButton
            aria-label='Variants'
            size='xs'
            variant='ghost'
            onClick={() => {
              setVariantsTarget(p)
              setVariantsOpen(true)
            }}
          >
            <LuLayers />
          </IconButton>
          <IconButton
            aria-label='Images'
            size='xs'
            variant='ghost'
            onClick={() => {
              setImagesTarget(p)
              setImagesOpen(true)
            }}
          >
            <LuImage />
          </IconButton>
          <IconButton
            aria-label='Delete'
            size='xs'
            variant='ghost'
            colorPalette='red'
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
      <PageHeader title='Products'>
        <Button
          colorPalette='blue'
          size='sm'
          onClick={() => {
            setEditProduct(null)
            setFormOpen(true)
          }}
        >
          <LuPlus />
          Create Product
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
        title='Delete Product'
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
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
