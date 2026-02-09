'use client'

import { formatDate, formatPermission } from '@app/utils'
import { Button, HStack, IconButton } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { PermissionFormDialog } from '@/components/permissions/permission-form-dialog'
import { TableSkeleton } from '@/components/table-skeleton'
import { toaster } from '@/components/ui/toaster'
import { permissionsApi } from '@/lib/api/permissions'
import type { Permission } from '@/types'

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [editPerm, setEditPerm] = useState<Permission | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null)
  const [deleting, setDeleting] = useState(false)

  const limit = 10

  const fetchPermissions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await permissionsApi.list(page, limit)

      setPermissions(res.items)
      setTotal(res.total)
    } catch {
      toaster.error({ title: 'Failed to load permissions' })
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      await permissionsApi.delete(deleteTarget.id)
      toaster.success({ title: 'Permission deleted' })
      setDeleteOpen(false)
      fetchPermissions()
    } catch {
      toaster.error({ title: 'Delete failed' })
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      header: 'Permission',
      accessor: (p: Permission) => formatPermission(p.action, p.resource),
    },
    { header: 'Action', accessor: 'action' as const },
    { header: 'Resource', accessor: 'resource' as const },
    {
      header: 'Description',
      accessor: (p: Permission) => p.description ?? '-',
    },
    {
      header: 'Created',
      accessor: (p: Permission) => formatDate(p.createdAt),
    },
    {
      header: 'Actions',
      accessor: (p: Permission) => (
        <HStack gap={'1'}>
          <IconButton
            aria-label={'Edit'}
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
            aria-label={'Delete'}
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
      <PageHeader title={'Permissions'}>
        <Button
          colorPalette={'blue'}
          size={'sm'}
          onClick={() => {
            setEditPerm(null)
            setFormOpen(true)
          }}
        >
          <LuPlus />
          Create Permission
        </Button>
      </PageHeader>

      {loading ? (
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
        onSaved={fetchPermissions}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={'Delete Permission'}
        description={`Are you sure you want to delete "${deleteTarget ? `${deleteTarget.action}:${deleteTarget.resource}` : ''}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
