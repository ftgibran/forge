'use client'

import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function AppFooter() {
  const t = useTranslations('footer')

  return (
    <Box as={'footer'} borderTopWidth={'1px'} bg={'bg.subtle'} py={'12'}>
      <Container maxW={'7xl'} px={'4'}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={'8'}
          justify={'space-between'}
        >
          <VStack align={'flex-start'} gap={'2'}>
            <Heading size={'sm'}>{t('shop')}</Heading>
            <Link href={'/products'}>
              <Text color={'fg.muted'} fontSize={'sm'}>
                {t('products')}
              </Text>
            </Link>
            <Link href={'/categories'}>
              <Text color={'fg.muted'} fontSize={'sm'}>
                {t('categories')}
              </Text>
            </Link>
          </VStack>

          <VStack align={'flex-start'} gap={'2'}>
            <Heading size={'sm'}>{t('account')}</Heading>
            <Link href={'/login'}>
              <Text color={'fg.muted'} fontSize={'sm'}>
                {t('login')}
              </Text>
            </Link>
            <Link href={'/register'}>
              <Text color={'fg.muted'} fontSize={'sm'}>
                {t('register')}
              </Text>
            </Link>
            <Link href={'/orders'}>
              <Text color={'fg.muted'} fontSize={'sm'}>
                {t('orders')}
              </Text>
            </Link>
          </VStack>

          <VStack align={'flex-start'} gap={'2'}>
            <Heading size={'sm'}>{t('about')}</Heading>
            <Text color={'fg.muted'} fontSize={'sm'}>
              {t('aboutDescription')}
            </Text>
            <Text color={'fg.muted'} fontSize={'sm'}>
              {t('aboutSubtitle')}
            </Text>
          </VStack>
        </Flex>

        <HStack justify={'center'} mt={'8'} pt={'8'} borderTopWidth={'1px'}>
          <Text color={'fg.muted'} fontSize={'sm'}>
            &copy; {new Date().getFullYear()} Marketplace.{' '}
            {t('allRightsReserved')}
          </Text>
        </HStack>
      </Container>
    </Box>
  )
}
