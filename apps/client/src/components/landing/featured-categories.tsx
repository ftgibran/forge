'use client'

import type { Category } from '@app/sdk'
import {
  Card,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'

interface FeaturedCategoriesProps {
  categories: Category[]
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  if (categories.length === 0) return null

  return (
    <Container maxW={'7xl'} py={'16'} px={'4'}>
      <VStack gap={'8'}>
        <VStack gap={'2'} textAlign={'center'}>
          <Heading size={'2xl'}>Shop by Category</Heading>
          <Text color={'fg.muted'}>
            Find exactly what you&apos;re looking for
          </Text>
        </VStack>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={'6'} w={'full'}>
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card.Root
                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                transition={'all 0.2s'}
                cursor={'pointer'}
              >
                <Card.Body>
                  <VStack gap={'1'}>
                    <Heading size={'md'}>{category.name}</Heading>
                    {category._count && (
                      <Text color={'fg.muted'} fontSize={'sm'}>
                        {category._count.products} products
                      </Text>
                    )}
                  </VStack>
                </Card.Body>
              </Card.Root>
            </Link>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  )
}
