'use client'

import {
  Card,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { LuStar } from 'react-icons/lu'

const testimonials = [
  {
    name: 'Sarah M.',
    rating: 5,
    comment:
      'Amazing quality prints! The detail on the miniatures I ordered was incredible.',
  },
  {
    name: 'James T.',
    rating: 5,
    comment:
      "Great marketplace for unique items. Found custom parts I couldn't get anywhere else.",
  },
  {
    name: 'Emily R.',
    rating: 4,
    comment: 'Love the variety of sellers and products. Fast shipping too!',
  },
]

export function Testimonials() {
  const t = useTranslations('landing')

  return (
    <Container maxW={'7xl'} py={'16'} px={'4'}>
      <VStack gap={'8'}>
        <VStack gap={'2'} textAlign={'center'}>
          <Heading size={'2xl'}>{t('testimonialsHeading')}</Heading>
          <Text color={'fg.muted'}>{t('testimonialsDescription')}</Text>
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={'6'} w={'full'}>
          {testimonials.map((testimonial) => (
            <Card.Root key={testimonial.name}>
              <Card.Body>
                <VStack align={'flex-start'} gap={'3'}>
                  <HStack>
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <LuStar
                        key={i}
                        fill={'currentColor'}
                        color={'var(--chakra-colors-yellow-400)'}
                        size={16}
                      />
                    ))}
                  </HStack>
                  <Text color={'fg.muted'}>{testimonial.comment}</Text>
                  <Text fontWeight={'semibold'}>{testimonial.name}</Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  )
}
