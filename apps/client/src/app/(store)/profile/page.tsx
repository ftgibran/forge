'use client'

import { AuthGateway, useGetProfile } from '@app/sdk'
import { Card, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { PageContainer } from '@/components/page-container'

export default function ProfilePage() {
  const { data: user } = useGetProfile()
  const router = useRouter()
  const t = useTranslations('profile')

  return (
    <AuthGateway onReject={() => router.push('/login')}>
      <PageContainer>
        <Heading size={'xl'} mb={'6'}>
          {t('heading')}
        </Heading>

        <Card.Root maxW={'lg'}>
          <Card.Body>
            <VStack align={'stretch'} gap={'4'}>
              <HStack justify={'space-between'}>
                <Text color={'fg.muted'}>{t('nameLabel')}</Text>
                <Text fontWeight={'medium'}>{user?.name}</Text>
              </HStack>
              <HStack justify={'space-between'}>
                <Text color={'fg.muted'}>{t('emailLabel')}</Text>
                <Text fontWeight={'medium'}>{user?.email}</Text>
              </HStack>
              <HStack justify={'space-between'}>
                <Text color={'fg.muted'}>{t('memberSince')}</Text>
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
    </AuthGateway>
  )
}
