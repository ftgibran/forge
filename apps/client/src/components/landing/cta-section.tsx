'use client'

import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'

export function CTASection() {
  return (
    <Box bg={'blue.subtle'} py={'16'}>
      <Container maxW={'4xl'}>
        <VStack gap={'6'} textAlign={'center'}>
          <Heading size={'2xl'}>Ready to Start Selling?</Heading>
          <Text fontSize={'lg'} color={'fg.muted'} maxW={'xl'}>
            Join our community of 3D printing creators and reach customers
            worldwide. Set up your shop in minutes.
          </Text>
          <Button asChild colorPalette={'blue'} size={'lg'}>
            <Link href={'/sell'}>Apply as a Seller</Link>
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}
