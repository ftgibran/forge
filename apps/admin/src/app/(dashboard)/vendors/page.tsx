'use client'

import type { Vendor } from '@app/sdk'
import { useDeleteVendor, useGetVendors } from '@app/sdk'
import { toaster } from '@app/theme'
import { formatDate } from '@app/utils'
import { Badge, Button, HStack, IconButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { LuClipboardList, LuPencil, LuTrash2 } from 'react-icons/lu'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DataTable } from '@/components/DataTable'
import { PageHeader } from '@/components/PageHeader'
import { TableSkeleton } from '@/components/TableSkeleton'
import { VendorApplicationsDialog } from '@/components/vendors/VendorApplicationsDialog'
import { VendorFormDialog } from '@/components/vendors/VendorFormDialog'

const statusColor: Record<string, string> = {
  PENDING: 'yellow',
  ACTIVE: 'green',
  SUSPENDED: 'red',
}

export default function VendorsPage() {
  const t = useTranslations('vendors')
  const tc = useTranslations('common')
  const tn = useTranslations('nav')

  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editVendor, setEditVendor] = useState<Vendor | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null)

  const [appsOpen, setAppsOpen] = useState(false)

  const limit = 10

  const { data, isLoading } = useGetVendors({ page, limit })

  const vendors = data?.items ?? []
  const total = data?.total ?? 0

  const deleteMutation = useDeleteVendor()

  const handleDelete = () => {
    if (!deleteTarget) return

    deleteMutation.mutate(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          toaster.success({ title: t('vendorDeleted') })
          setDeleteOpen(false)
        },
        onError: () => {
          toaster.error({ title: tc('deleteFailed') })
        },
      },
    )
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

      {isLoading ? (
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
        onSaved={() => {}}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('deleteVendor')}
        description={tc('deleteConfirm', { name: deleteTarget?.name ?? '' })}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />

      <VendorApplicationsDialog
        open={appsOpen}
        onOpenChange={setAppsOpen}
        onReviewed={() => {}}
      />
    </>
  )
}
