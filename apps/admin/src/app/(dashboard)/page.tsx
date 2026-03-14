'use client'

import { formatDate } from '@app/utils'
import { Badge, Box, SimpleGrid, Table, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import {
  LuBox,
  LuKey,
  LuShield,
  LuShoppingCart,
  LuStore,
  LuUsers,
} from 'react-icons/lu'

import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { TableSkeleton } from '@/components/table-skeleton'
import { ordersApi } from '@/lib/api/orders'
import { permissionsApi } from '@/lib/api/permissions'
import { productsApi } from '@/lib/api/products'
import { rolesApi } from '@/lib/api/roles'
import { usersApi } from '@/lib/api/users'
import { vendorsApi } from '@/lib/api/vendors'
import type { User } from '@/types'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const tn = useTranslations('nav')
  const tc = useTranslations('common')
  const [users, setUsers] = useState<User[]>([])
  const [counts, setCounts] = useState({
    users: 0,
    roles: 0,
    permissions: 0,
    vendors: 0,
    products: 0,
    orders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      usersApi.list(1, 5),
      rolesApi.list(1, 1),
      permissionsApi.list(1, 1),
      vendorsApi.list(1, 1),
      productsApi.list({ page: 1, limit: 1 }),
      ordersApi.list(1, 1),
    ])
      .then(([userRes, roleRes, permRes, vendorRes, productRes, orderRes]) => {
        setUsers(userRes.items)
        setCounts({
          users: userRes.total,
          roles: roleRes.total,
          permissions: permRes.total,
          vendors: vendorRes.total,
          products: productRes.total,
          orders: orderRes.total,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHeader title={t('title')} />

      <SimpleGrid columns={{ base: 1, md: 3, lg: 6 }} gap={'6'} mb={'8'}>
        <StatCard label={tn('users')} value={counts.users} icon={LuUsers} />
        <StatCard label={tn('roles')} value={counts.roles} icon={LuShield} />
        <StatCard
          label={tn('permissions')}
          value={counts.permissions}
          icon={LuKey}
        />
        <StatCard label={tn('vendors')} value={counts.vendors} icon={LuStore} />
        <StatCard label={tn('products')} value={counts.products} icon={LuBox} />
        <StatCard
          label={tn('orders')}
          value={counts.orders}
          icon={LuShoppingCart}
        />
      </SimpleGrid>

      <Box>
        <Text fontWeight={'medium'} mb={'4'} fontSize={'lg'}>
          {t('recentUsers')}
        </Text>
        {loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <Table.Root size={'sm'} variant={'outline'}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>{tc('name')}</Table.ColumnHeader>
                <Table.ColumnHeader>{tc('email')}</Table.ColumnHeader>
                <Table.ColumnHeader>{tn('roles')}</Table.ColumnHeader>
                <Table.ColumnHeader>{tc('created')}</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell fontWeight={'medium'}>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.userRoles?.map((ur) => (
                      <Badge key={ur.role.id} mr={'1'} size={'sm'}>
                        {ur.role.name}
                      </Badge>
                    )) ?? '-'}
                  </Table.Cell>
                  <Table.Cell color={'fg.muted'}>
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
