'use client'

import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function HeroSection() {
  const t = useTranslations('landing')

  return (
    <Box bg={'bg.subtle'} py={'20'}>
      <Container maxW={'4xl'}>
        <VStack gap={'6'} textAlign={'center'}>
          <Heading size={'4xl'} fontWeight={'bold'}>
            {t('heroHeading')}
          </Heading>
          <Text fontSize={'xl'} color={'fg.muted'} maxW={'2xl'}>
            {t('heroDescription')}
          </Text>
          <HStack gap={'4'}>
            <Button asChild colorPalette={'blue'} size={'lg'}>
              <Link href={'/products'}>{t('heroBrowseButton')}</Link>
            </Button>
            <Button asChild variant={'outline'} size={'lg'}>
              <Link href={'/sell'}>{t('heroSellButton')}</Link>
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}
