'use client'

import { Button, Heading, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <VStack minH={'100vh'} justify={'center'} gap={'4'}>
      <Heading size={'4xl'}>{t('title')}</Heading>
      <Text color={'fg.muted'} fontSize={'lg'}>
        {t('description')}
      </Text>
      <Button asChild colorPalette={'blue'}>
        <Link href={'/'}>{t('goHome')}</Link>
      </Button>
    </VStack>
  )
}
