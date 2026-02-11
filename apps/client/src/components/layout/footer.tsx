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

export function Footer() {
  return (
    <Box as={'footer'} borderTopWidth={'1px'} bg={'bg.subtle'} py={'12'}>
      <Container maxW={'7xl'} px={'4'}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={'8'}
          justify={'space-between'}
        >
          <VStack align={'flex-start'} gap={'2'}>
            <Heading size={'sm'}>Shop</Heading>
            <Link href={'/products'}>
              <Text color={'fg.muted'} fontSize={'sm'}>
                Products
              </Text>
            </Link>
            <Link href={'/categories'}>
              <Text color={'fg.muted'} fontSize={'sm'}>
                Categories
              </Text>
            </Link>
          </VStack>

          <VStack align={'flex-start'} gap={'2'}>
            <Heading size={'sm'}>Account</Heading>
            <Link href={'/login'}>
              <Text color={'fg.muted'} fontSize={'sm'}>
                Login
              </Text>
            </Link>
            <Link href={'/register'}>
              <Text color={'fg.muted'} fontSize={'sm'}>
                Register
              </Text>
            </Link>
            <Link href={'/orders'}>
              <Text color={'fg.muted'} fontSize={'sm'}>
                Orders
              </Text>
            </Link>
          </VStack>

          <VStack align={'flex-start'} gap={'2'}>
            <Heading size={'sm'}>About</Heading>
            <Text color={'fg.muted'} fontSize={'sm'}>
              3D Print Marketplace
            </Text>
            <Text color={'fg.muted'} fontSize={'sm'}>
              Buy and sell custom 3D printed products
            </Text>
          </VStack>
        </Flex>

        <HStack justify={'center'} mt={'8'} pt={'8'} borderTopWidth={'1px'}>
          <Text color={'fg.muted'} fontSize={'sm'}>
            &copy; {new Date().getFullYear()} Marketplace. All rights reserved.
          </Text>
        </HStack>
      </Container>
    </Box>
  )
}
