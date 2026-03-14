'use client'

import { Box, Flex } from '@chakra-ui/react'

import { LocaleSwitcher } from '@/components/locale-switcher'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'bg.subtle'}>
      <Box pos={'absolute'} top={'4'} right={'4'}>
        <LocaleSwitcher />
      </Box>
      {children}
    </Flex>
  )
}
