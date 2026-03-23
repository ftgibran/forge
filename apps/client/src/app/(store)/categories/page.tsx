'use client'

import { useGetCategories } from '@app/sdk'
import { Card, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { EmptyState } from '@/components/empty-state'
import { PageContainer } from '@/components/page-container'

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useGetCategories()
  const t = useTranslations('categories')

  return (
    <PageContainer>
      <VStack align={'stretch'} gap={'6'}>
        <Heading size={'xl'}>{t('heading')}</Heading>

        {!isLoading && categories.length === 0 ? (
          <EmptyState
            title={t('emptyTitle')}
            description={t('emptyDescription')}
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
                          {t('productsCount', {
                            count: category._count.products,
                          })}
                        </Text>
                      )}
                    </VStack>
                  </Card.Body>
                  {category.children && category.children.length > 0 && (
                    <Card.Footer>
                      <Text fontSize={'xs'} color={'fg.muted'}>
                        {t('subcategoriesCount', {
                          count: category.children.length,
                        })}
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
