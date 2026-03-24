'use client'

import type { User } from '@app/sdk'
import {
  useGetOrders,
  useGetPermissions,
  useGetProducts,
  useGetRoles,
  useGetUsers,
  useGetVendors,
} from '@app/sdk'
import { formatDate } from '@app/utils'
import { Box, SimpleGrid, Table, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import {
  LuBox,
  LuKey,
  LuShield,
  LuShoppingCart,
  LuStore,
  LuUsers,
} from 'react-icons/lu'

import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { TableSkeleton } from '@/components/TableSkeleton'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const tn = useTranslations('nav')
  const tc = useTranslations('common')

  const { data: usersData, isLoading: loading } = useGetUsers({
    page: 1,
    limit: 5,
  })
  const { data: rolesData } = useGetRoles({ page: 1, limit: 1 })
  const { data: permissionsData } = useGetPermissions({ page: 1, limit: 1 })
  const { data: vendorsData } = useGetVendors({ page: 1, limit: 1 })
  const { data: productsData } = useGetProducts({ page: 1, limit: 1 })
  const { data: ordersData } = useGetOrders({ page: 1, limit: 1 })

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
                <Table.ColumnHeader>{tc('created')}</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell fontWeight={'medium'}>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
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
