'use client'

import { useEffect, useState } from 'react'
import { SimpleGrid, Table, Badge, Box, Text } from '@chakra-ui/react'
import { LuUsers, LuShield, LuKey } from 'react-icons/lu'
import { formatDate } from '@app/utils'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { TableSkeleton } from '@/components/table-skeleton'
import { usersApi } from '@/lib/api/users'
import { rolesApi } from '@/lib/api/roles'
import { permissionsApi } from '@/lib/api/permissions'
import type { User } from '@/types'

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [counts, setCounts] = useState({ users: 0, roles: 0, permissions: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      usersApi.list(1, 5),
      rolesApi.list(1, 1),
      permissionsApi.list(1, 1),
    ])
      .then(([userRes, roleRes, permRes]) => {
        setUsers(userRes.items)
        setCounts({
          users: userRes.total,
          roles: roleRes.total,
          permissions: permRes.total,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHeader title='Dashboard' />

      <SimpleGrid columns={{ base: 1, md: 3 }} gap='6' mb='8'>
        <StatCard label='Users' value={counts.users} icon={LuUsers} />
        <StatCard label='Roles' value={counts.roles} icon={LuShield} />
        <StatCard label='Permissions' value={counts.permissions} icon={LuKey} />
      </SimpleGrid>

      <Box>
        <Text fontWeight='medium' mb='4' fontSize='lg'>
          Recent Users
        </Text>
        {loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <Table.Root size='sm' variant='outline'>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Roles</Table.ColumnHeader>
                <Table.ColumnHeader>Created</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell fontWeight='medium'>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.userRoles?.map((ur) => (
                      <Badge key={ur.role.id} mr='1' size='sm'>
                        {ur.role.name}
                      </Badge>
                    )) ?? '-'}
                  </Table.Cell>
                  <Table.Cell color='fg.muted'>
                    {formatDate(user.createdAt)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
    </>
  )
}
