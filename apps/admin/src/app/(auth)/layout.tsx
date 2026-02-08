'use client'

import { Flex } from '@chakra-ui/react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Flex minH='100vh' align='center' justify='center' bg='bg.subtle'>
      {children}
    </Flex>
  )
}
