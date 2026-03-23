'use client'

import { useGetProfile } from '@app/sdk'
import { Card, Heading, HStack, Text, VStack } from '@chakra-ui/react'

import { AuthGuard } from '@/components/auth-guard'
import { PageContainer } from '@/components/page-container'

export default function ProfilePage() {
  const { data: user } = useGetProfile()

  return (
    <AuthGuard>
      <PageContainer>
        <Heading size={'xl'} mb={'6'}>
          Profile
        </Heading>

        <Card.Root maxW={'lg'}>
          <Card.Body>
            <VStack align={'stretch'} gap={'4'}>
              <HStack justify={'space-between'}>
                <Text color={'fg.muted'}>Name</Text>
                <Text fontWeight={'medium'}>{user?.name}</Text>
              </HStack>
              <HStack justify={'space-between'}>
                <Text color={'fg.muted'}>Email</Text>
                <Text fontWeight={'medium'}>{user?.email}</Text>
              </HStack>
              <HStack justify={'space-between'}>
                <Text color={'fg.muted'}>Member since</Text>
                <Text fontWeight={'medium'}>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : '—'}
                </Text>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>
      </PageContainer>
    </AuthGuard>
  )
}
