'use client'

import { Badge, Card, Heading, Stack, Text, HStack } from '@chakra-ui/react'
import { formatDate, formatPermission } from '@app/utils'
import { useAuth } from '@/lib/auth-context'
import { PageHeader } from '@/components/page-header'

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <>
      <PageHeader title='Profile' />

      <Stack gap='6' maxW='2xl'>
        <Card.Root>
          <Card.Header>
            <Heading size='md'>Account Info</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap='3'>
              <HStack justify='space-between'>
                <Text color='fg.muted'>Name</Text>
                <Text fontWeight='medium'>{user.name}</Text>
              </HStack>
              <HStack justify='space-between'>
                <Text color='fg.muted'>Email</Text>
                <Text fontWeight='medium'>{user.email}</Text>
              </HStack>
              <HStack justify='space-between'>
                <Text color='fg.muted'>Member since</Text>
                <Text fontWeight='medium'>{formatDate(user.createdAt)}</Text>
              </HStack>
            </Stack>
          </Card.Body>
        </Card.Root>

        {user.userRoles && user.userRoles.length > 0 && (
          <Card.Root>
            <Card.Header>
              <Heading size='md'>Roles</Heading>
            </Card.Header>
            <Card.Body>
              <HStack gap='2' flexWrap='wrap'>
                {user.userRoles.map((ur) => (
                  <Badge key={ur.role.id} size='lg' colorPalette='blue'>
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
              <Heading size='md'>Direct Permissions</Heading>
            </Card.Header>
            <Card.Body>
              <HStack gap='2' flexWrap='wrap'>
                {user.userPermissions.map((up) => (
                  <Badge key={up.permission.id} size='lg' colorPalette='purple'>
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
