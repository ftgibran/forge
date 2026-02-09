'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button, Badge, HStack, IconButton } from '@chakra-ui/react'
import { LuPencil, LuTrash2, LuClipboardList } from 'react-icons/lu'
import { formatDate } from '@app/utils'
import { PageHeader } from '@/components/page-header'
import { DataTable } from '@/components/data-table'
import { TableSkeleton } from '@/components/table-skeleton'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { VendorFormDialog } from '@/components/vendors/vendor-form-dialog'
import { VendorApplicationsDialog } from '@/components/vendors/vendor-applications-dialog'
import { vendorsApi } from '@/lib/api/vendors'
import { toaster } from '@/components/ui/toaster'
import type { Vendor } from '@/types'

const statusColor: Record<string, string> = {
  PENDING: 'yellow',
  ACTIVE: 'green',
  SUSPENDED: 'red',
}

export default function VendorsPage() {
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
      toaster.error({ title: 'Failed to load vendors' })
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchVendors()
  }, [fetchVendors])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await vendorsApi.delete(deleteTarget.id)
      toaster.success({ title: 'Vendor deleted' })
      setDeleteOpen(false)
      fetchVendors()
    } catch {
      toaster.error({ title: 'Delete failed' })
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { header: 'Name', accessor: (v: Vendor) => v.name },
    {
      header: 'Owner',
      accessor: (v: Vendor) => v.owner?.name ?? '-',
    },
    {
      header: 'Status',
      accessor: (v: Vendor) => (
        <Badge colorPalette={statusColor[v.status]} size='sm'>
          {v.status}
        </Badge>
      ),
    },
    {
      header: 'Products',
      accessor: (v: Vendor) => v._count?.products ?? 0,
    },
    {
      header: 'Created',
      accessor: (v: Vendor) => formatDate(v.createdAt),
    },
    {
      header: 'Actions',
      accessor: (v: Vendor) => (
        <HStack gap='1'>
          <IconButton
            aria-label='Edit'
            size='xs'
            variant='ghost'
            onClick={() => {
              setEditVendor(v)
              setFormOpen(true)
            }}
          >
            <LuPencil />
          </IconButton>
          <IconButton
            aria-label='Delete'
            size='xs'
            variant='ghost'
            colorPalette='red'
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
      <PageHeader title='Vendors'>
        <Button size='sm' variant='outline' onClick={() => setAppsOpen(true)}>
          <LuClipboardList />
          Applications
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
        title='Delete Vendor'
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
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
