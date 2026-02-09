'use client'

import { formatDate } from '@app/utils'
import { Badge, Button, HStack, IconButton } from '@chakra-ui/react'
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
      toaster.error({ title: 'Failed to load roles' })
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      await rolesApi.delete(deleteTarget.id)
      toaster.success({ title: 'Role deleted' })
      setDeleteOpen(false)
      fetchRoles()
    } catch {
      toaster.error({ title: 'Delete failed' })
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { header: 'Name', accessor: (r: Role) => r.name },
    {
      header: 'Description',
      accessor: (r: Role) => r.description ?? '-',
    },
    {
      header: 'Permissions',
      accessor: (r: Role) =>
        r.rolePermissions?.length ? (
          <Badge size={'sm'}>{r.rolePermissions.length} permissions</Badge>
        ) : (
          '-'
        ),
    },
    {
      header: 'Created',
      accessor: (r: Role) => formatDate(r.createdAt),
    },
    {
      header: 'Actions',
      accessor: (r: Role) => (
        <HStack gap={'1'}>
          <IconButton
            aria-label={'Edit'}
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
            aria-label={'Manage permissions'}
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
            aria-label={'Delete'}
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
      <PageHeader title={'Roles'}>
        <Button
          colorPalette={'blue'}
          size={'sm'}
          onClick={() => {
            setEditRole(null)
            setFormOpen(true)
          }}
        >
          <LuPlus />
          Create Role
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
        title={'Delete Role'}
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
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
