'use client'

import type { ProductImage } from '@app/sdk'
import { Box, HStack, Image, VStack } from '@chakra-ui/react'
import { useState } from 'react'

interface ProductImagesProps {
  images: ProductImage[]
  productName: string
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedImage = images[selectedIndex]

  if (images.length === 0) {
    return (
      <Image
        src={'https://via.placeholder.com/600x400?text=No+Image'}
        alt={productName}
        w={'full'}
        borderRadius={'md'}
      />
    )
  }

  return (
    <VStack gap={'4'}>
      <Image
        src={selectedImage?.media?.url ?? undefined}
        alt={selectedImage?.altText || productName}
        w={'full'}
        maxH={'500px'}
        objectFit={'contain'}
        borderRadius={'md'}
        bg={'bg.subtle'}
      />
      {images.length > 1 && (
        <HStack gap={'2'} overflowX={'auto'}>
          {images.map((image, index) => (
            <Box
              key={image.id}
              cursor={'pointer'}
              borderWidth={'2px'}
              borderColor={index === selectedIndex ? 'blue.500' : 'transparent'}
              borderRadius={'md'}
              overflow={'hidden'}
              flexShrink={0}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={image.media?.url ?? undefined}
                alt={image.altText || `${productName} ${index + 1}`}
                w={'80px'}
                h={'80px'}
                objectFit={'cover'}
              />
            </Box>
          ))}
        </HStack>
      )}
    </VStack>
  )
}
