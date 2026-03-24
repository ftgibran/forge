'use client'

import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function CTASection() {
  const t = useTranslations('landing')

  return (
    <Box bg={'blue.subtle'} py={'16'}>
      <Container maxW={'4xl'}>
        <VStack gap={'6'} textAlign={'center'}>
          <Heading size={'2xl'}>{t('ctaHeading')}</Heading>
          <Text fontSize={'lg'} color={'fg.muted'} maxW={'xl'}>
            {t('ctaDescription')}
          </Text>
          <Button asChild colorPalette={'blue'} size={'lg'}>
            <Link href={'/sell'}>{t('ctaButton')}</Link>
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}
