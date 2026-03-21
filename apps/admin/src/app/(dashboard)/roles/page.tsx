'use client'

import type { Role } from '@app/sdk'
import { useDeleteRole, useGetRoles } from '@app/sdk'
import { formatDate } from '@app/utils'
import { Badge, Button, HStack, IconButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { LuKey, LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { RoleFormDialog } from '@/components/roles/role-form-dialog'
import { RolePermissionsDialog } from '@/components/roles/role-permissions-dialog'
import { TableSkeleton } from '@/components/table-skeleton'
import { toaster } from '@/components/ui/toaster'

export default function RolesPage() {
  const t = useTranslations('roles')
  const tc = useTranslations('common')
  const tn = useTranslations('nav')

  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editRole, setEditRole] = useState<Role | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)

  const [permsOpen, setPermsOpen] = useState(false)
  const [permsTarget, setPermsTarget] = useState<Role | null>(null)

  const limit = 10

  const { data, isLoading } = useGetRoles({ page, limit })

  const roles = data?.items ?? []
  const total = data?.total ?? 0

  const deleteMutation = useDeleteRole()

  const handleDelete = () => {
    if (!deleteTarget) return

    deleteMutation.mutate(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          toaster.success({ title: t('roleDeleted') })
          setDeleteOpen(false)
        },
        onError: () => {
          toaster.error({ title: tc('deleteFailed') })
        },
      },
    )
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

      {isLoading ? (
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
        onSaved={() => {}}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('deleteRole')}
        description={tc('deleteConfirm', { name: deleteTarget?.name ?? '' })}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />

      <RolePermissionsDialog
        open={permsOpen}
        onOpenChange={setPermsOpen}
        role={permsTarget}
        onSaved={() => {}}
      />
    </>
  )
}
