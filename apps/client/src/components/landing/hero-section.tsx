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

export function HeroSection() {
  return (
    <Box bg={'bg.subtle'} py={'20'}>
      <Container maxW={'4xl'}>
        <VStack gap={'6'} textAlign={'center'}>
          <Heading size={'4xl'} fontWeight={'bold'}>
            Discover Unique 3D Printed Products
          </Heading>
          <Text fontSize={'xl'} color={'fg.muted'} maxW={'2xl'}>
            Browse a curated marketplace of custom 3D printed items from
            talented creators worldwide.
          </Text>
          <HStack gap={'4'}>
            <Button asChild colorPalette={'blue'} size={'lg'}>
              <Link href={'/products'}>Browse Products</Link>
            </Button>
            <Button asChild variant={'outline'} size={'lg'}>
              <Link href={'/sell'}>Start Selling</Link>
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}
