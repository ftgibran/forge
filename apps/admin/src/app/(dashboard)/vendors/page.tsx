'use client'

import { formatDate } from '@app/utils'
import { Badge, Button, HStack, IconButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { LuClipboardList, LuPencil, LuTrash2 } from 'react-icons/lu'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { TableSkeleton } from '@/components/table-skeleton'
import { toaster } from '@/components/ui/toaster'
import { VendorApplicationsDialog } from '@/components/vendors/vendor-applications-dialog'
import { VendorFormDialog } from '@/components/vendors/vendor-form-dialog'
import { vendorsApi } from '@/lib/api/vendors'
import type { Vendor } from '@/types'

const statusColor: Record<string, string> = {
  PENDING: 'yellow',
  ACTIVE: 'green',
  SUSPENDED: 'red',
}

export default function VendorsPage() {
  const t = useTranslations('vendors')
  const tc = useTranslations('common')
  const tn = useTranslations('nav')
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [editVendor, setEditVendor] = useState<Vendor | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [appsOpen, setAppsOpen] = useState(false)

  const limit = 10

  const fetchVendors = useCallback(async () => {
    setLoading(true)
    try {
      const res = await vendorsApi.list(page, limit)

      setVendors(res.items)
      setTotal(res.total)
    } catch {
      toaster.error({ title: t('loadFailed') })
    } finally {
      setLoading(false)
    }
  }, [page, t])

  useEffect(() => {
    fetchVendors()
  }, [fetchVendors])

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      await vendorsApi.delete(deleteTarget.id)
      toaster.success({ title: t('vendorDeleted') })
      setDeleteOpen(false)
      fetchVendors()
    } catch {
      toaster.error({ title: tc('deleteFailed') })
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { header: tc('name'), accessor: (v: Vendor) => v.name },
    {
      header: t('owner'),
      accessor: (v: Vendor) => v.owner?.name ?? '-',
    },
    {
      header: tc('status'),
      accessor: (v: Vendor) => (
        <Badge colorPalette={statusColor[v.status]} size={'sm'}>
          {v.status}
        </Badge>
      ),
    },
    {
      header: tn('products'),
      accessor: (v: Vendor) => v._count?.products ?? 0,
    },
    {
      header: tc('created'),
      accessor: (v: Vendor) => formatDate(v.createdAt),
    },
    {
      header: tc('actions'),
      accessor: (v: Vendor) => (
        <HStack gap={'1'}>
          <IconButton
            aria-label={tc('edit')}
            size={'xs'}
            variant={'ghost'}
            onClick={() => {
              setEditVendor(v)
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
              setDeleteTarget(v)
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
          size={'sm'}
          variant={'outline'}
          onClick={() => setAppsOpen(true)}
        >
          <LuClipboardList />
          {t('applications')}
        </Button>
      </PageHeader>

      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={vendors}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
        />
      )}

      <VendorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        vendor={editVendor}
        onSaved={fetchVendors}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('deleteVendor')}
        description={tc('deleteConfirm', { name: deleteTarget?.name ?? '' })}
        onConfirm={handleDelete}
        loading={deleting}
      />

      <VendorApplicationsDialog
        open={appsOpen}
        onOpenChange={setAppsOpen}
        onReviewed={fetchVendors}
      />
    </>
  )
}
