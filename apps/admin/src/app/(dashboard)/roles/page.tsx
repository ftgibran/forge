'use client'

import { formatDate } from '@app/utils'
import { Badge, Button, HStack, IconButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { LuKey, LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { RoleFormDialog } from '@/components/roles/role-form-dialog'
import { RolePermissionsDialog } from '@/components/roles/role-permissions-dialog'
import { TableSkeleton } from '@/components/table-skeleton'
import { toaster } from '@/components/ui/toaster'
import { rolesApi } from '@/lib/api/roles'
import type { Role } from '@/types'

export default function RolesPage() {
  const t = useTranslations('roles')
  const tc = useTranslations('common')
  const tn = useTranslations('nav')
  const [roles, setRoles] = useState<Role[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [editRole, setEditRole] = useState<Role | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [permsOpen, setPermsOpen] = useState(false)
  const [permsTarget, setPermsTarget] = useState<Role | null>(null)

  const limit = 10

  const fetchRoles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await rolesApi.list(page, limit)

      setRoles(res.items)
      setTotal(res.total)
    } catch {
      toaster.error({ title: t('loadFailed') })
    } finally {
      setLoading(false)
    }
  }, [page, t])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      await rolesApi.delete(deleteTarget.id)
      toaster.success({ title: t('roleDeleted') })
      setDeleteOpen(false)
      fetchRoles()
    } catch {
      toaster.error({ title: tc('deleteFailed') })
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { header: tc('name'), accessor: (r: Role) => r.name },
    {
      header: tc('description'),
      accessor: (r: Role) => r.description ?? '-',
    },
    {
      header: tn('permissions'),
      accessor: (r: Role) =>
        r.rolePermissions?.length ? (
          <Badge size={'sm'}>
            {t('permissionCount', { count: r.rolePermissions.length })}
          </Badge>
        ) : (
          '-'
        ),
    },
    {
      header: tc('created'),
      accessor: (r: Role) => formatDate(r.createdAt),
    },
    {
      header: tc('actions'),
      accessor: (r: Role) => (
        <HStack gap={'1'}>
          <IconButton
            aria-label={tc('edit')}
            size={'xs'}
            variant={'ghost'}
            onClick={() => {
              setEditRole(r)
              setFormOpen(true)
            }}
          >
            <LuPencil />
          </IconButton>
          <IconButton
            aria-label={t('permissionsFor', { name: r.name })}
            size={'xs'}
            variant={'ghost'}
            onClick={() => {
              setPermsTarget(r)
              setPermsOpen(true)
            }}
          >
            <LuKey />
          </IconButton>
          <IconButton
            aria-label={tc('delete')}
            size={'xs'}
            variant={'ghost'}
            colorPalette={'red'}
            onClick={() => {
              setDeleteTarget(r)
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
            setEditRole(null)
            setFormOpen(true)
          }}
        >
          <LuPlus />
          {t('createRole')}
        </Button>
      </PageHeader>

      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={roles}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
        />
      )}

      <RoleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        role={editRole}
        onSaved={fetchRoles}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('deleteRole')}
        description={tc('deleteConfirm', { name: deleteTarget?.name ?? '' })}
        onConfirm={handleDelete}
        loading={deleting}
      />

      <RolePermissionsDialog
        open={permsOpen}
        onOpenChange={setPermsOpen}
        role={permsTarget}
        onSaved={fetchRoles}
      />
    </>
  )
}
