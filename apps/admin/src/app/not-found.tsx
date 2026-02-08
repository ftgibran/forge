'use client'

import { Button, Heading, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <VStack minH='100vh' justify='center' gap='4'>
      <Heading size='4xl'>404</Heading>
      <Text color='fg.muted' fontSize='lg'>
        Page not found
      </Text>
      <Button asChild variant='outline'>
        <Link href='/'>Go home</Link>
      </Button>
    </VStack>
  )
}
