'use client'

import { formatDate, formatPermission } from '@app/utils'
import { Badge, Card, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

import { PageHeader } from '@/components/page-header'
import { useAuth } from '@/lib/auth-context'

export default function ProfilePage() {
  const { user } = useAuth()
  const t = useTranslations('profile')
  const tc = useTranslations('common')

  if (!user) return null

  return (
    <>
      <PageHeader title={t('title')} />

      <Stack gap={'6'} maxW={'2xl'}>
        <Card.Root>
          <Card.Header>
            <Heading size={'md'}>{t('accountInfo')}</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={'3'}>
              <HStack justify={'space-between'}>
                <Text color={'fg.muted'}>{tc('name')}</Text>
                <Text fontWeight={'medium'}>{user.name}</Text>
              </HStack>
              <HStack justify={'space-between'}>
                <Text color={'fg.muted'}>{tc('email')}</Text>
                <Text fontWeight={'medium'}>{user.email}</Text>
              </HStack>
              <HStack justify={'space-between'}>
                <Text color={'fg.muted'}>{t('memberSince')}</Text>
                <Text fontWeight={'medium'}>{formatDate(user.createdAt)}</Text>
              </HStack>
            </Stack>
          </Card.Body>
        </Card.Root>

        {user.userRoles && user.userRoles.length > 0 && (
          <Card.Root>
            <Card.Header>
              <Heading size={'md'}>{t('roles')}</Heading>
            </Card.Header>
            <Card.Body>
              <HStack gap={'2'} flexWrap={'wrap'}>
                {user.userRoles.map((ur) => (
                  <Badge key={ur.role.id} size={'lg'} colorPalette={'blue'}>
                    {ur.role.name}
                  </Badge>
                ))}
              </HStack>
            </Card.Body>
          </Card.Root>
        )}

        {user.userPermissions && user.userPermissions.length > 0 && (
          <Card.Root>
            <Card.Header>
              <Heading size={'md'}>{t('directPermissions')}</Heading>
            </Card.Header>
            <Card.Body>
              <HStack gap={'2'} flexWrap={'wrap'}>
                {user.userPermissions.map((up) => (
                  <Badge
                    key={up.permission.id}
                    size={'lg'}
                    colorPalette={'purple'}
                  >
                    {formatPermission(
                      up.permission.action,
                      up.permission.resource,
                    )}
                  </Badge>
                ))}
              </HStack>
            </Card.Body>
          </Card.Root>
        )}
      </Stack>
    </>
  )
}
