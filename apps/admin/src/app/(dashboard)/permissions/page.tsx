'use client'

import { formatDate, formatPermission } from '@app/utils'
import { Button, HStack, IconButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('permissions')
  const tc = useTranslations('common')
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
      toaster.error({ title: t('loadFailed') })
    } finally {
      setLoading(false)
    }
  }, [page, t])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      await permissionsApi.delete(deleteTarget.id)
      toaster.success({ title: t('permissionDeleted') })
      setDeleteOpen(false)
      fetchPermissions()
    } catch {
      toaster.error({ title: tc('deleteFailed') })
    } finally {
      setDeleting(false)
    }
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
        title={t('deletePermission')}
        description={tc('deleteConfirm', {
          name: deleteTarget
            ? `${deleteTarget.action}:${deleteTarget.resource}`
            : '',
        })}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
