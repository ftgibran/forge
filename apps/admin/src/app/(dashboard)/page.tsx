'use client'

import { formatDate } from '@app/utils'
import { Badge, Box, SimpleGrid, Table, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
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

  const { data: usersData, isLoading: loading } = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: () => usersApi.list(1, 5),
  })

  const { data: rolesData } = useQuery({
    queryKey: ['dashboard-roles'],
    queryFn: () => rolesApi.list(1, 1),
  })

  const { data: permissionsData } = useQuery({
    queryKey: ['dashboard-permissions'],
    queryFn: () => permissionsApi.list(1, 1),
  })

  const { data: vendorsData } = useQuery({
    queryKey: ['dashboard-vendors'],
    queryFn: () => vendorsApi.list(1, 1),
  })

  const { data: productsData } = useQuery({
    queryKey: ['dashboard-products'],
    queryFn: () => productsApi.list({ page: 1, limit: 1 }),
  })

  const { data: ordersData } = useQuery({
    queryKey: ['dashboard-orders'],
    queryFn: () => ordersApi.list(1, 1),
  })

  const users: User[] = usersData?.items ?? []

  return (
    <>
      <PageHeader title={t('title')} />

      <SimpleGrid columns={{ base: 1, md: 3, lg: 6 }} gap={'6'} mb={'8'}>
        <StatCard
          label={tn('users')}
          value={usersData?.total ?? 0}
          icon={LuUsers}
        />
        <StatCard
          label={tn('roles')}
          value={rolesData?.total ?? 0}
          icon={LuShield}
        />
        <StatCard
          label={tn('permissions')}
          value={permissionsData?.total ?? 0}
          icon={LuKey}
        />
        <StatCard
          label={tn('vendors')}
          value={vendorsData?.total ?? 0}
          icon={LuStore}
        />
        <StatCard
          label={tn('products')}
          value={productsData?.total ?? 0}
          icon={LuBox}
        />
        <StatCard
          label={tn('orders')}
          value={ordersData?.total ?? 0}
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
