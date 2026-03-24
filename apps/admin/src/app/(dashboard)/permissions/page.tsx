'use client'

import type { Permission } from '@app/sdk'
import { useDeletePermission, useGetPermissions } from '@app/sdk'
import { toaster } from '@app/theme'
import { formatDate, formatPermission } from '@app/utils'
import { Button, HStack, IconButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { DataTable } from '@/components/DataTable'
import { PageHeader } from '@/components/PageHeader'
import { PermissionFormDialog } from '@/components/permissions/PermissionFormDialog'
import { TableSkeleton } from '@/components/TableSkeleton'

export default function PermissionsPage() {
  const t = useTranslations('permissions')
  const tc = useTranslations('common')

  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editPerm, setEditPerm] = useState<Permission | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null)

  const limit = 10

  const { data, isLoading } = useGetPermissions({ page, limit })

  const permissions = data?.items ?? []
  const total = data?.total ?? 0

  const deleteMutation = useDeletePermission()

  const handleDelete = () => {
    if (!deleteTarget) return

    deleteMutation.mutate(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          toaster.success({ title: t('permissionDeleted') })
          setDeleteOpen(false)
        },
        onError: () => {
          toaster.error({ title: tc('deleteFailed') })
        },
      },
    )
  }

  const columns = [
    {
      header: t('permission'),
      accessor: (p: Permission) => formatPermission(p.action, p.resource),
    },
    { header: t('action'), accessor: 'action' as const },
    { header: t('resource'), accessor: 'resource' as const },
    {
      header: tc('description'),
      accessor: (p: Permission) => p.description ?? '-',
    },
    {
      header: tc('created'),
      accessor: (p: Permission) => formatDate(p.createdAt),
    },
    {
      header: tc('actions'),
      accessor: (p: Permission) => (
        <HStack gap={'1'}>
          <IconButton
            aria-label={tc('edit')}
            size={'xs'}
            variant={'ghost'}
            onClick={() => {
              setEditPerm(p)
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
            setEditPerm(null)
            setFormOpen(true)
          }}
        >
          <LuPlus />
          {t('createPermission')}
        </Button>
      </PageHeader>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={permissions}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
        />
      )}

      <PermissionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        permission={editPerm}
        onSaved={() => {}}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('deletePermission')}
        description={tc('deleteConfirm', {
          name: deleteTarget
            ? `${deleteTarget.action}:${deleteTarget.resource}`
            : '',
        })}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </>
  )
}
