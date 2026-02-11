'use client'

import { Container } from '@chakra-ui/react'

interface PageContainerProps {
  children: React.ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <Container maxW={'7xl'} py={'8'} px={'4'}>
      {children}
    </Container>
  )
}
