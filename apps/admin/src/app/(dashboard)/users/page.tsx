'use client'

import { formatDate } from '@app/utils'
import { Badge, Button, HStack, IconButton } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { LuKey, LuPencil, LuPlus, LuShield, LuTrash2 } from 'react-icons/lu'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { TableSkeleton } from '@/components/table-skeleton'
import { toaster } from '@/components/ui/toaster'
import { UserFormDialog } from '@/components/users/user-form-dialog'
import { UserPermissionsDialog } from '@/components/users/user-permissions-dialog'
import { UserRolesDialog } from '@/components/users/user-roles-dialog'
import { usersApi } from '@/lib/api/users'
import type { User } from '@/types'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [rolesOpen, setRolesOpen] = useState(false)
  const [rolesTarget, setRolesTarget] = useState<User | null>(null)

  const [permsOpen, setPermsOpen] = useState(false)
  const [permsTarget, setPermsTarget] = useState<User | null>(null)

  const limit = 10

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await usersApi.list(page, limit)

      setUsers(res.items)
      setTotal(res.total)
    } catch {
      toaster.error({ title: 'Failed to load users' })
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      await usersApi.delete(deleteTarget.id)
      toaster.success({ title: 'User deleted' })
      setDeleteOpen(false)
      fetchUsers()
    } catch {
      toaster.error({ title: 'Delete failed' })
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { header: 'Name', accessor: (u: User) => u.name },
    { header: 'Email', accessor: (u: User) => u.email },
    {
      header: 'Roles',
      accessor: (u: User) =>
        u.userRoles?.map((ur) => (
          <Badge key={ur.role.id} mr={'1'} size={'sm'}>
            {ur.role.name}
          </Badge>
        )) ?? '-',
    },
    {
      header: 'Created',
      accessor: (u: User) => formatDate(u.createdAt),
    },
    {
      header: 'Actions',
      accessor: (u: User) => (
        <HStack gap={'1'}>
          <IconButton
            aria-label={'Edit'}
            size={'xs'}
            variant={'ghost'}
            onClick={() => {
              setEditUser(u)
              setFormOpen(true)
            }}
          >
            <LuPencil />
          </IconButton>
          <IconButton
            aria-label={'Manage roles'}
            size={'xs'}
            variant={'ghost'}
            onClick={() => {
              setRolesTarget(u)
              setRolesOpen(true)
            }}
          >
            <LuShield />
          </IconButton>
          <IconButton
            aria-label={'Manage permissions'}
            size={'xs'}
            variant={'ghost'}
            onClick={() => {
              setPermsTarget(u)
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
              setDeleteTarget(u)
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
      <PageHeader title={'Users'}>
        <Button
          colorPalette={'blue'}
          size={'sm'}
          onClick={() => {
            setEditUser(null)
            setFormOpen(true)
          }}
        >
          <LuPlus />
          Create User
        </Button>
      </PageHeader>

      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
        />
      )}

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editUser}
        onSaved={fetchUsers}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={'Delete User'}
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={deleting}
      />

      <UserRolesDialog
        open={rolesOpen}
        onOpenChange={setRolesOpen}
        user={rolesTarget}
        onSaved={fetchUsers}
      />

      <UserPermissionsDialog
        open={permsOpen}
        onOpenChange={setPermsOpen}
        user={permsTarget}
        onSaved={fetchUsers}
      />
    </>
  )
}
