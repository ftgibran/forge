'use client'

import { Flex, Heading } from '@chakra-ui/react'

interface PageHeaderProps {
  title: string
  children?: React.ReactNode
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <Flex mb={'6'} align={'center'} justify={'space-between'}>
      <Heading size={'xl'}>{title}</Heading>
      <Flex gap={'2'}>{children}</Flex>
    </Flex>
  )
}
