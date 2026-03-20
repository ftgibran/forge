'use client'

import { useCategories } from '@app/sdk'
import { Card, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'

import { EmptyState } from '@/components/empty-state'
import { PageContainer } from '@/components/page-container'

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()

  return (
    <PageContainer>
      <VStack align={'stretch'} gap={'6'}>
        <Heading size={'xl'}>Categories</Heading>

        {!isLoading && categories.length === 0 ? (
          <EmptyState
            title={'No categories yet'}
            description={'Check back later for new categories.'}
          />
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={'6'}>
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card.Root
                  _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                  transition={'all 0.2s'}
                  cursor={'pointer'}
                  h={'full'}
                >
                  <Card.Body>
                    <VStack gap={'2'}>
                      <Heading size={'md'}>{category.name}</Heading>
                      {category.description && (
                        <Text
                          color={'fg.muted'}
                          fontSize={'sm'}
                          lineClamp={2}
                          textAlign={'center'}
                        >
                          {category.description}
                        </Text>
                      )}
                      {category._count && (
                        <Text color={'fg.muted'} fontSize={'sm'}>
                          {category._count.products} products
                        </Text>
                      )}
                    </VStack>
                  </Card.Body>
                  {category.children && category.children.length > 0 && (
                    <Card.Footer>
                      <Text fontSize={'xs'} color={'fg.muted'}>
                        {category.children.length} subcategories
                      </Text>
                    </Card.Footer>
                  )}
                </Card.Root>
              </Link>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </PageContainer>
  )
}
