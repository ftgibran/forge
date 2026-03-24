'use client'

import { ChakraProvider } from '@chakra-ui/react'

import { ColorModeProvider, type ColorModeProviderProps } from './ColorMode'
import { system } from '../theme'

export function DesignSystemProvider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
